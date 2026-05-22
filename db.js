/**
 * db.js — SQLite database layer for ReLaunchHer
 * Uses better-sqlite3 (synchronous, file-based, zero-config)
 * Database file: ./relaunchher.db
 */

import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "relaunchher.db");

const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ─────────────────────────────────────────────
// SCHEMA — create tables if they don't exist
// ─────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password   TEXT NOT NULL,
    role       TEXT NOT NULL DEFAULT 'returnee',
    language   TEXT NOT NULL DEFAULT 'en',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token      TEXT PRIMARY KEY,
    user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS plans (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile    TEXT NOT NULL,
    analysis   TEXT NOT NULL,
    saved_at   TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS progress (
    user_id    TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    checklist  TEXT NOT NULL DEFAULT '{}',
    notes      TEXT NOT NULL DEFAULT '',
    wins       TEXT NOT NULL DEFAULT '[]',
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS job_states (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    saved   TEXT NOT NULL DEFAULT '[]',
    applied TEXT NOT NULL DEFAULT '[]'
  );
`);

// ─────────────────────────────────────────────
// USER OPERATIONS
// ─────────────────────────────────────────────

/** Returns true if a user with that email already exists */
export function emailExists(email) {
  const row = db.prepare("SELECT id FROM users WHERE email = ?").get(email.trim().toLowerCase());
  return !!row;
}

/** Insert a new user. Throws if email already taken. */
export function createUser({ id, name, email, password, role, language }) {
  db.prepare(`
    INSERT INTO users (id, name, email, password, role, language, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, name.trim(), email.trim().toLowerCase(), password, role, language || "en", new Date().toISOString());

  return getUserById(id);
}

/** Find a user by email and password (plain comparison — upgrade to bcrypt for prod) */
export function findUserByCredentials(email, password) {
  return db.prepare(`
    SELECT * FROM users WHERE email = ? AND password = ?
  `).get(email.trim().toLowerCase(), password) || null;
}

/** Find a user by id */
export function getUserById(id) {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) || null;
}

/** Return all users (for admin use) */
export function getAllUsers() {
  return db.prepare("SELECT id, name, email, role, language, created_at FROM users").all();
}

/** Update user fields */
export function updateUser(id, partial) {
  const allowed = ["name", "language", "role"];
  const keys = Object.keys(partial).filter((k) => allowed.includes(k));
  if (!keys.length) return getUserById(id);
  const sets = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) => partial[k]);
  db.prepare(`UPDATE users SET ${sets} WHERE id = ?`).run(...values, id);
  return getUserById(id);
}

// ─────────────────────────────────────────────
// SESSION OPERATIONS
// ─────────────────────────────────────────────
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/** Create a session token for a user */
export function createSession(userId) {
  // Simple token: user_id + random hex (use crypto.randomUUID for prod)
  const token = `${userId}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_TTL_MS);
  db.prepare(`
    INSERT INTO sessions (token, user_id, created_at, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(token, userId, now.toISOString(), expires.toISOString());
  return token;
}

/** Validate a session token and return the user, or null if invalid/expired */
export function getSessionUser(token) {
  if (!token) return null;
  const session = db.prepare(`
    SELECT * FROM sessions WHERE token = ? AND expires_at > ?
  `).get(token, new Date().toISOString());
  if (!session) return null;
  return getUserById(session.user_id);
}

/** Delete a session (logout) */
export function deleteSession(token) {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

/** Clean up expired sessions */
export function pruneExpiredSessions() {
  db.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(new Date().toISOString());
}

// ─────────────────────────────────────────────
// PLAN OPERATIONS
// ─────────────────────────────────────────────

/** Save or replace a user's plan */
export function savePlan(userId, profile, analysis) {
  // Keep only latest plan per user (upsert pattern)
  const existing = db.prepare("SELECT id FROM plans WHERE user_id = ?").get(userId);
  if (existing) {
    db.prepare(`
      UPDATE plans SET profile = ?, analysis = ?, saved_at = ? WHERE user_id = ?
    `).run(JSON.stringify(profile), JSON.stringify(analysis), new Date().toISOString(), userId);
  } else {
    db.prepare(`
      INSERT INTO plans (user_id, profile, analysis, saved_at)
      VALUES (?, ?, ?, ?)
    `).run(userId, JSON.stringify(profile), JSON.stringify(analysis), new Date().toISOString());
  }
}

/** Load a user's saved plan */
export function loadPlan(userId) {
  const row = db.prepare("SELECT * FROM plans WHERE user_id = ?").get(userId);
  if (!row) return null;
  return {
    profile: JSON.parse(row.profile),
    analysis: JSON.parse(row.analysis),
    savedAt: row.saved_at,
  };
}

/** Load all plans (admin/dashboard use) */
export function loadAllPlans() {
  return db.prepare("SELECT * FROM plans").all().reduce((acc, row) => {
    acc[row.user_id] = {
      profile: JSON.parse(row.profile),
      analysis: JSON.parse(row.analysis),
      savedAt: row.saved_at,
    };
    return acc;
  }, {});
}

// ─────────────────────────────────────────────
// PROGRESS OPERATIONS
// ─────────────────────────────────────────────

export function loadProgress(userId) {
  const row = db.prepare("SELECT * FROM progress WHERE user_id = ?").get(userId);
  if (!row) return { checklist: {}, notes: "", wins: [] };
  return {
    checklist: JSON.parse(row.checklist),
    notes: row.notes,
    wins: JSON.parse(row.wins),
  };
}

export function saveProgress(userId, progress) {
  const now = new Date().toISOString();
  const existing = db.prepare("SELECT user_id FROM progress WHERE user_id = ?").get(userId);
  if (existing) {
    db.prepare(`
      UPDATE progress SET checklist = ?, notes = ?, wins = ?, updated_at = ? WHERE user_id = ?
    `).run(
      JSON.stringify(progress.checklist || {}),
      progress.notes || "",
      JSON.stringify(progress.wins || []),
      now,
      userId
    );
  } else {
    db.prepare(`
      INSERT INTO progress (user_id, checklist, notes, wins, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      userId,
      JSON.stringify(progress.checklist || {}),
      progress.notes || "",
      JSON.stringify(progress.wins || []),
      now
    );
  }
}

// ─────────────────────────────────────────────
// JOB STATE OPERATIONS
// ─────────────────────────────────────────────

export function loadJobState(userId) {
  const row = db.prepare("SELECT * FROM job_states WHERE user_id = ?").get(userId);
  if (!row) return { saved: [], applied: [] };
  return { saved: JSON.parse(row.saved), applied: JSON.parse(row.applied) };
}

export function saveJobState(userId, state) {
  const existing = db.prepare("SELECT user_id FROM job_states WHERE user_id = ?").get(userId);
  if (existing) {
    db.prepare("UPDATE job_states SET saved = ?, applied = ? WHERE user_id = ?")
      .run(JSON.stringify(state.saved), JSON.stringify(state.applied), userId);
  } else {
    db.prepare("INSERT INTO job_states (user_id, saved, applied) VALUES (?, ?, ?)")
      .run(userId, JSON.stringify(state.saved), JSON.stringify(state.applied));
  }
}

export function loadAllJobStates() {
  return db.prepare("SELECT * FROM job_states").all().reduce((acc, row) => {
    acc[row.user_id] = {
      saved: JSON.parse(row.saved),
      applied: JSON.parse(row.applied)
    };
    return acc;
  }, {});
}

// ─────────────────────────────────────────────
// JOBS AND MENTORS OPERATIONS
// ─────────────────────────────────────────────

export function getAllJobs() {
  try {
    return db.prepare("SELECT * FROM posted_jobs ORDER BY created_at DESC").all();
  } catch {
    return [];
  }
}

export function createJob(job) {
  const id = `job-${Date.now()}`;
  db.prepare(`
    INSERT INTO posted_jobs (id, recruiter_id, title, company, type, mode, location, match_role, summary, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, job.recruiterId || "admin", job.title, job.company, job.type, job.mode, job.location, job.matchRole, job.summary, new Date().toISOString());
  return db.prepare("SELECT * FROM posted_jobs WHERE id = ?").get(id);
}

export function getAllMentors() {
  try {
    return db.prepare(`
      SELECT p.id, p.mentor_id, u.name, p.role_title as role, p.specialty 
      FROM mentor_profiles p 
      JOIN users u ON p.mentor_id = u.id
    `).all();
  } catch {
    return [];
  }
}

export default db;
