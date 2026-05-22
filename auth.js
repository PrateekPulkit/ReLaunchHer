/**
 * auth.js — Client-side auth layer
 * Talks to the /api/auth/* REST endpoints on the server.
 * Session is maintained via an HttpOnly cookie (server-side).
 * A minimal user object is cached in sessionStorage for quick reads.
 */

const USER_CACHE_KEY = "relaunchher.user.cache";

export const roles = [
  { id: "returnee",  labelKey: "roles.returnee"  },
  { id: "mentor",    labelKey: "roles.mentor"     },
  { id: "recruiter", labelKey: "roles.recruiter"  },
];

// ─────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────
function cacheUser(user) {
  if (user) {
    sessionStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
  } else {
    sessionStorage.removeItem(USER_CACHE_KEY);
  }
}

function getCachedUser() {
  try {
    const raw = sessionStorage.getItem(USER_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function apiPost(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",           // send/receive session cookie
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ─────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────

/**
 * Register a new user.
 * Returns the user object on success; throws on failure.
 */
export async function registerUser(payload) {
  const data = await apiPost("/api/auth/register", payload);
  cacheUser(data.user);
  return data.user;
}

/**
 * Log in an existing user.
 * Returns the user object on success; throws on failure.
 */
export async function loginUser(email, password) {
  const data = await apiPost("/api/auth/login", { email, password });
  cacheUser(data.user);
  return data.user;
}

/**
 * Get the currently logged-in user.
 * - First tries sessionStorage cache (sync, instant).
 * - Falls back to GET /api/auth/me (async, authoritative).
 * Returns null if not logged in.
 */
export function getCurrentUser() {
  return getCachedUser();
}

/**
 * Fetch the current user from the server (authoritative).
 * Call this on page load to validate the session cookie.
 */
export async function fetchCurrentUser() {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (!res.ok) { cacheUser(null); return null; }
    const data = await res.json();
    cacheUser(data.user);
    return data.user;
  } catch {
    return null;
  }
}

/**
 * Log out the current user.
 */
export async function logoutUser() {
  cacheUser(null);
  try {
    await apiPost("/api/auth/logout", {});
  } catch {
    // silently clear cache even if network fails
  }
}

/**
 * Update user profile fields on the server.
 */
export async function updateUser(userId, partial) {
  // For now, client-side update only updates cache
  // (Extend server with PATCH /api/user if needed)
  const current = getCachedUser();
  if (current && current.id === userId) {
    const updated = { ...current, ...partial };
    cacheUser(updated);
    return updated;
  }
  return null;
}

/**
 * Fetch all users (admin use only).
 */
export async function getAllUsers() {
  const res = await fetch("/api/users", { credentials: "include" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.users || [];
}
