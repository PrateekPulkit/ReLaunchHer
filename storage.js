/**
 * storage.js — Client-side storage layer
 *
 * Plan, progress, and job state are persisted to the server DB via API.
 * Jobs and mentors still live locally (static demo data) since they are
 * not user-specific write operations in this version.
 *
 * For instant UI reads some data is cached in localStorage as a
 * last-known-good fallback, refreshed after every successful API call.
 */

// ── Local cache keys (fallback / offline) ────────────────────────────────────
const CACHE = {
  plan:       "relaunchher.plan.cache",
  progress:   "relaunchher.progress.cache",
  jobState:   "relaunchher.jobState.cache",
  jobs:       "relaunchher.jobs.v4",
  mentorState:"relaunchher.mentorState.v4",
  ui:         "relaunchher.ui.v4",
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function safeParse(value, fallback) {
  try { return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
}
function readLocal(key, fallback) {
  return safeParse(localStorage.getItem(key), fallback);
}
function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

async function apiFetch(path, options = {}) {
  const res = await fetch(path, { credentials: "include", ...options });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API ${path} failed`);
  }
  return res.json();
}

async function apiPost(path, body) {
  return apiFetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ─────────────────────────────────────────────
// UI STATE (localStorage only — per-device pref)
// ─────────────────────────────────────────────
export function loadUiState() {
  return readLocal(CACHE.ui, {});
}
export function saveUiState(state) {
  writeLocal(CACHE.ui, state);
}

// ─────────────────────────────────────────────
// PLAN — save to DB, cache locally for instant reads
// ─────────────────────────────────────────────
export async function savePlan(userId, profile, analysis) {
  const payload = { profile, analysis };
  // Optimistic local cache
  writeLocal(CACHE.plan, { [userId]: { profile, analysis, savedAt: new Date().toISOString() } });
  try {
    await apiPost("/api/plan", payload);
  } catch (err) {
    console.warn("Plan save to DB failed (cached locally):", err.message);
  }
}

export async function loadPlan(userId) {
  try {
    const data = await apiFetch("/api/plan");
    if (data.plan) {
      writeLocal(CACHE.plan, { [userId]: data.plan });
      return data.plan;
    }
  } catch {
    // Fall back to local cache
  }
  const cached = readLocal(CACHE.plan, {});
  return cached[userId] || null;
}

export function loadPlanSync(userId) {
  const cached = readLocal(CACHE.plan, {});
  return cached[userId] || null;
}

export async function loadAllPlans() {
  try {
    const data = await apiFetch("/api/plans");
    return data.plans ? data.plans : {};
  } catch {
    return readLocal(CACHE.plan, {});
  }
}

// ─────────────────────────────────────────────
// PROGRESS — save to DB, cache locally
// ─────────────────────────────────────────────
export async function loadProgress(userId) {
  try {
    const data = await apiFetch("/api/progress");
    if (data.progress) {
      writeLocal(CACHE.progress, { [userId]: data.progress });
      return data.progress;
    }
  } catch { /* fall through */ }
  const cached = readLocal(CACHE.progress, {});
  return cached[userId] || { checklist: {}, notes: "", wins: [] };
}

export function loadProgressSync(userId) {
  const cached = readLocal(CACHE.progress, {});
  return cached[userId] || { checklist: {}, notes: "", wins: [] };
}

export async function saveProgress(userId, progress) {
  writeLocal(CACHE.progress, { [userId]: progress });
  try {
    await apiPost("/api/progress", progress);
  } catch (err) {
    console.warn("Progress save to DB failed (cached locally):", err.message);
  }
}

// ─────────────────────────────────────────────
// JOBS — Fetch from DB API
// ─────────────────────────────────────────────
export async function loadJobs() {
  try {
    const data = await apiFetch("/api/jobs");
    if (data.jobs) {
      writeLocal(CACHE.jobs, data.jobs);
      return data.jobs;
    }
  } catch { /* fall through */ }
  return readLocal(CACHE.jobs, []);
}

export async function addJob(job) {
  try {
    const res = await apiPost("/api/jobs", job);
    if (res.job) {
      const current = readLocal(CACHE.jobs, []);
      writeLocal(CACHE.jobs, [res.job, ...current]);
    }
  } catch (err) {
    console.warn("Job addition failed:", err.message);
  }
}

// ─────────────────────────────────────────────
// MENTORS — Fetch from DB API
// ─────────────────────────────────────────────
export async function loadMentors() {
  try {
    const data = await apiFetch("/api/mentors");
    if (data.mentors) {
      writeLocal(CACHE.mentorState, { ...readLocal(CACHE.mentorState, {}), directory: data.mentors });
      return data.mentors;
    }
  } catch { /* fall through */ }
  const s = readLocal(CACHE.mentorState, null);
  return s?.directory || [];
}

export function requestMentor(userId, mentorId, requestType = "Mentorship") {
  const s = readLocal(CACHE.mentorState, { directory: [], requests: [], active: [] });
  if (!s.requests) s.requests = [];
  s.requests.unshift({ id: `request-${Date.now()}`, userId, mentorId, type: requestType, createdAt: new Date().toISOString() });
  writeLocal(CACHE.mentorState, s);
}

export function loadMentorRequests() {
  const s = readLocal(CACHE.mentorState, { directory: [], requests: [], active: [] });
  return s.requests || [];
}

export function acceptMentorRequest(requestId) {
  const s = readLocal(CACHE.mentorState, { directory: [], requests: [], active: [] });
  if (!s.requests) return;
  const idx = s.requests.findIndex((r) => r.id === requestId);
  if (idx !== -1) {
    const req = s.requests.splice(idx, 1)[0];
    if (!s.active) s.active = [];
    s.active.unshift({ ...req, acceptedAt: new Date().toISOString() });
    writeLocal(CACHE.mentorState, s);
  }
}

export function loadActiveMentees() {
  const s = readLocal(CACHE.mentorState, { directory: [], requests: [], active: [] });
  return s.active || [];
}

// ─────────────────────────────────────────────
// JOB STATE — save to DB, cache locally
// ─────────────────────────────────────────────
export async function loadJobState(userId) {
  try {
    const data = await apiFetch("/api/jobstate");
    if (data.jobState) {
      writeLocal(CACHE.jobState, { [userId]: data.jobState });
      return data.jobState;
    }
  } catch { /* fall through */ }
  const cached = readLocal(CACHE.jobState, {});
  return cached[userId] || { saved: [], applied: [] };
}

export function loadJobStateSync(userId) {
  const cached = readLocal(CACHE.jobState, {});
  return cached[userId] || { saved: [], applied: [] };
}

export async function loadAllJobStates() {
  try {
    const data = await apiFetch("/api/jobstates");
    return data.jobStates ? data.jobStates : {};
  } catch {
    return readLocal(CACHE.jobState, {});
  }
}

export async function saveJobState(userId, state) {
  writeLocal(CACHE.jobState, { [userId]: state });
  try {
    await apiPost("/api/jobstate", state);
  } catch (err) {
    console.warn("Job state save to DB failed (cached locally):", err.message);
  }
}

export async function toggleSavedJob(userId, jobId) {
  const state = await loadJobState(userId);
  state.saved = state.saved.includes(jobId)
    ? state.saved.filter((item) => item !== jobId)
    : [jobId, ...state.saved];
  await saveJobState(userId, state);
  return state;
}

export async function applyToJob(userId, jobId) {
  const state = await loadJobState(userId);
  if (!state.applied.includes(jobId)) {
    state.applied.unshift(jobId);
    await saveJobState(userId, state);
  }
  return state;
}
