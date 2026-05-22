/**
 * server.js — ReLaunchHer static file server + REST API
 *
 * API routes (all under /api/):
 *   POST /api/auth/register
 *   POST /api/auth/login
 *   POST /api/auth/logout
 *   GET  /api/auth/me          (requires session cookie)
 *
 *   GET  /api/plan             (requires session cookie)
 *   POST /api/plan             (requires session cookie)
 *
 *   GET  /api/progress         (requires session cookie)
 *   POST /api/progress         (requires session cookie)
 *
 *   GET  /api/jobstate         (requires session cookie)
 *   POST /api/jobstate         (requires session cookie)
 *
 *   GET  /api/users            (requires session cookie — admin)
 */

import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  emailExists, createUser, findUserByCredentials, getUserById, getAllUsers, updateUser,
  createSession, getSessionUser, deleteSession, pruneExpiredSessions,
  savePlan, loadPlan, loadAllPlans,
  loadProgress, saveProgress,
  loadJobState, saveJobState,
  getAllJobs, createJob, getAllMentors
} from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const SESSION_COOKIE = "relaunchher_sid";

// ─────────────────────────────────────────────
// STATIC FILE SERVING
// ─────────────────────────────────────────────
const MIME = {
  ".css":   "text/css; charset=utf-8",
  ".html":  "text/html; charset=utf-8",
  ".js":    "application/javascript; charset=utf-8",
  ".json":  "application/json; charset=utf-8",
  ".png":   "image/png",
  ".svg":   "image/svg+xml",
  ".ico":   "image/x-icon",
  ".woff2": "font/woff2",
  ".woff":  "font/woff",
};

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function resolveFilePath(requestUrl) {
  const url = new URL(requestUrl, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";
  let filePath = path.join(__dirname, pathname);
  if (!path.extname(filePath) && existsSync(`${filePath}.html`)) {
    filePath = `${filePath}.html`;
  }
  return filePath;
}

function send404(res) {
  const notFoundPath = path.join(__dirname, "404.html");
  if (existsSync(notFoundPath)) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache", ...SECURITY_HEADERS });
    createReadStream(notFoundPath).pipe(res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
}

// ─────────────────────────────────────────────
// API HELPERS
// ─────────────────────────────────────────────
function parseCookies(req) {
  const cookies = {};
  const header = req.headers["cookie"] || "";
  header.split(";").forEach((part) => {
    const [k, ...rest] = part.trim().split("=");
    if (k) cookies[k.trim()] = decodeURIComponent(rest.join("="));
  });
  return cookies;
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => { data += chunk; });
    req.on("end", () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch { reject(new Error("Invalid JSON")); }
    });
    req.on("error", reject);
  });
}

function json(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    ...SECURITY_HEADERS,
  });
  res.end(body);
}

function setCookie(res, name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.maxAge)   parts.push(`Max-Age=${options.maxAge}`);
  if (options.path)     parts.push(`Path=${options.path}`);
  res.setHeader("Set-Cookie", parts.join("; "));
}

function clearCookie(res, name) {
  res.setHeader("Set-Cookie", `${name}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`);
}

// Middleware: resolve session and attach user to request
function resolveSession(req) {
  const cookies = parseCookies(req);
  const token = cookies[SESSION_COOKIE];
  return { token, user: getSessionUser(token) };
}

// ─────────────────────────────────────────────
// API ROUTE HANDLERS
// ─────────────────────────────────────────────
async function handleApi(req, res, pathname) {
  // Remove /api prefix
  const route = pathname.replace(/^\/api/, "");

  // ── POST /api/auth/register ──────────────────
  if (route === "/auth/register" && req.method === "POST") {
    const body = await parseBody(req);
    const { name, email, password, role, language } = body;

    if (!name || !email || !password) {
      return json(res, 400, { error: "Name, email, and password are required." });
    }
    if (emailExists(email)) {
      return json(res, 409, { error: "An account with this email already exists." });
    }

    const user = createUser({
      id: `user-${Date.now()}`,
      name, email, password,
      role: role || "returnee",
      language: language || "en",
    });
    const token = createSession(user.id);
    setCookie(res, SESSION_COOKIE, token, { httpOnly: true, sameSite: "Lax", maxAge: 604800, path: "/" });
    return json(res, 201, { user: { id: user.id, name: user.name, email: user.email, role: user.role, language: user.language } });
  }

  // ── POST /api/auth/login ─────────────────────
  if (route === "/auth/login" && req.method === "POST") {
    const body = await parseBody(req);
    const { email, password } = body;

    if (!email || !password) {
      return json(res, 400, { error: "Email and password are required." });
    }
    const user = findUserByCredentials(email, password);
    if (!user) {
      return json(res, 401, { error: "Incorrect email or password." });
    }
    const token = createSession(user.id);
    setCookie(res, SESSION_COOKIE, token, { httpOnly: true, sameSite: "Lax", maxAge: 604800, path: "/" });
    return json(res, 200, { user: { id: user.id, name: user.name, email: user.email, role: user.role, language: user.language } });
  }

  // ── POST /api/auth/logout ────────────────────
  if (route === "/auth/logout" && req.method === "POST") {
    const { token } = resolveSession(req);
    if (token) deleteSession(token);
    clearCookie(res, SESSION_COOKIE);
    return json(res, 200, { ok: true });
  }

  // ── GET /api/auth/me ─────────────────────────
  if (route === "/auth/me" && req.method === "GET") {
    const { user } = resolveSession(req);
    if (!user) return json(res, 401, { error: "Not authenticated." });
    return json(res, 200, { user: { id: user.id, name: user.name, email: user.email, role: user.role, language: user.language } });
  }

  // ── Require auth for everything below ────────
  const { user } = resolveSession(req);
  if (!user) return json(res, 401, { error: "Not authenticated." });

  // ── GET /api/plan ────────────────────────────
  if (route === "/plan" && req.method === "GET") {
    return json(res, 200, { plan: loadPlan(user.id) });
  }

  // ── POST /api/plan ───────────────────────────
  if (route === "/plan" && req.method === "POST") {
    const body = await parseBody(req);
    if (!body.profile || !body.analysis) return json(res, 400, { error: "profile and analysis required." });
    savePlan(user.id, body.profile, body.analysis);
    return json(res, 200, { ok: true, savedAt: new Date().toISOString() });
  }

  // ── GET /api/progress ────────────────────────
  if (route === "/progress" && req.method === "GET") {
    return json(res, 200, { progress: loadProgress(user.id) });
  }

  // ── POST /api/progress ───────────────────────
  if (route === "/progress" && req.method === "POST") {
    const body = await parseBody(req);
    saveProgress(user.id, body);
    return json(res, 200, { ok: true });
  }

  // ── GET /api/jobstate ────────────────────────
  if (route === "/jobstate" && req.method === "GET") {
    return json(res, 200, { jobState: loadJobState(user.id) });
  }

  // ── POST /api/jobstate ───────────────────────
  if (route === "/jobstate" && req.method === "POST") {
    const body = await parseBody(req);
    saveJobState(user.id, body);
    return json(res, 200, { ok: true });
  }

  // ── GET /api/users ───────────────────────────
  if (route === "/users" && req.method === "GET") {
    return json(res, 200, { users: getAllUsers() });
  }

  // ── GET /api/plans ───────────────────────────
  if (route === "/plans" && req.method === "GET") {
    return json(res, 200, { plans: loadAllPlans() });
  }

  // ── GET /api/jobstates ───────────────────────
  if (route === "/jobstates" && req.method === "GET") {
    return json(res, 200, { jobStates: loadAllJobStates() });
  }

  // ── GET /api/jobs ────────────────────────────
  if (route === "/jobs" && req.method === "GET") {
    return json(res, 200, { jobs: getAllJobs() });
  }

  // ── POST /api/jobs ───────────────────────────
  if (route === "/jobs" && req.method === "POST") {
    const body = await parseBody(req);
    body.recruiterId = user.id; // tie to current user
    const saved = createJob(body);
    return json(res, 200, { job: saved });
  }

  // ── GET /api/mentors ─────────────────────────
  if (route === "/mentors" && req.method === "GET") {
    return json(res, 200, { mentors: getAllMentors() });
  }

  return json(res, 404, { error: "API route not found." });
}

// ─────────────────────────────────────────────
// HTTP SERVER
// ─────────────────────────────────────────────
http
  .createServer(async (req, res) => {
    const url = new URL(req.url || "/", `http://localhost:${PORT}`);
    const pathname = decodeURIComponent(url.pathname);

    // Route API requests
    if (pathname.startsWith("/api/")) {
      try {
        await handleApi(req, res, pathname);
      } catch (err) {
        console.error("API error:", err);
        json(res, 500, { error: "Internal server error." });
      }
      return;
    }

    // Static file serving
    const filePath = resolveFilePath(req.url || "/");

    if (!filePath.startsWith(__dirname) || !existsSync(filePath)) {
      return send404(res);
    }

    const fileStats = await stat(filePath).catch(() => null);
    if (!fileStats?.isFile()) return send404(res);

    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Pragma": "no-cache",
      ...SECURITY_HEADERS,
    });
    createReadStream(filePath).pipe(res);
  })
  .listen(PORT, () => {
    console.log(`\n🌸 ReLaunchHer running at http://localhost:${PORT}`);
    console.log(`🗄  Database: relaunchher.db`);
    console.log(`📡 API:      http://localhost:${PORT}/api/\n`);
    // Prune expired sessions on startup
    pruneExpiredSessions();
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`\n⚠️  Port ${PORT} is already in use.\n`);
    } else {
      console.error(err);
    }
    process.exit(1);
  });
