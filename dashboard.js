import { getAllUsers } from "./auth.js";
import { loadAllJobStates, loadAllPlans, loadJobState, loadJobs, addJob, loadMentorRequests, acceptMentorRequest, loadActiveMentees, loadPlan, loadProgress, saveProgress } from "./storage.js";
import { initShell } from "./shell.js";
import { showToast } from "./toast.js";

const { currentUser } = initShell({ protectedPage: true });
const root = document.querySelector("#dashboard-root");

if (!currentUser) {
  throw new Error("Authentication required");
}

async function renderReturnee() {
  const savedPlan = await loadPlan(currentUser.id);
  
  if (!savedPlan) {
    root.innerHTML = `
      <section class="empty-state">
        <h1 data-i18n="dashboard.emptyTitle">Create a plan to unlock your dashboard.</h1>
        <p data-i18n="dashboard.emptyLead">Your saved roadmap, notes, jobs, and progress will appear here.</p>
        <a class="primary-button" href="./planner.html">Open planner</a>
      </section>
    `;
    return;
  }

  const progress = await loadProgress(currentUser.id);
  const jobState = await loadJobState(currentUser.id);
  const jobs = await loadJobs();

  root.innerHTML = `
    <section class="results-hero compact-hero">
      <div>
        <p class="eyebrow">${currentUser.name}</p>
        <h1>${savedPlan.analysis.role}</h1>
        <div class="pill-row">
          <span class="pill">${savedPlan.analysis.matchLabel}</span>
          <span class="pill">${savedPlan.analysis.matchPercent}% match</span>
        </div>
      </div>
      <div class="score-orb" style="--progress:${savedPlan.analysis.readinessScore}">
        <div>
          <span class="score-label">Readiness</span>
          <strong>${savedPlan.analysis.readinessScore}</strong>
        </div>
      </div>
    </section>

    <section class="card-grid three">
      <article class="content-card">
        <h2>Weekly sprint</h2>
        <ul class="interactive-list">
          ${savedPlan.analysis.weeklySprint
      .map(
        (item, index) => `
                <li>
                  <label class="check-row">
                    <input type="checkbox" data-task="task-${index}" ${progress.checklist[`task-${index}`] ? "checked" : ""} />
                    <span>${item}</span>
                  </label>
                </li>
              `,
      )
      .join("")}
        </ul>
      </article>

      <article class="content-card">
        <h2>Saved jobs</h2>
        <ul>${jobState.saved.length ? jobState.saved.map((jobId) => `<li>${jobs.find((job) => job.id === jobId)?.title || jobId}</li>`).join("") : "<li>No saved jobs yet</li>"}</ul>
      </article>

      <article class="content-card">
        <h2>Applied jobs</h2>
        <ul>${jobState.applied.length ? jobState.applied.map((jobId) => `<li>${jobs.find((job) => job.id === jobId)?.title || jobId}</li>`).join("") : "<li>No applications yet</li>"}</ul>
      </article>
    </section>

    <section class="card-grid two">
      <article class="content-card">
        <h2>Career notes</h2>
        <textarea id="notes-box" rows="8" placeholder="Track calls, practice notes, and wins.">${progress.notes || ""}</textarea>
      </article>
      <article class="content-card">
        <h2>Wins tracker</h2>
        <form id="win-form" class="inline-form">
          <input id="win-input" type="text" placeholder="Add a small win" />
          <button class="primary-button" type="submit">Add</button>
        </form>
        <ul id="wins-list" class="wins-list"></ul>
      </article>
    </section>
  `;

  const winsList = document.querySelector("#wins-list");
  const renderWins = () => {
    winsList.innerHTML = progress.wins.length
      ? progress.wins
        .map(
          (win, index) => `
              <li class="win-chip">
                <span>${win}</span>
                <button type="button" data-remove-win="${index}">×</button>
              </li>
            `,
        )
        .join("")
      : "<li>No wins logged yet</li>";

    winsList.querySelectorAll("[data-remove-win]").forEach((button) => {
      button.addEventListener("click", async () => {
        progress.wins.splice(Number(button.dataset.removeWin), 1);
        await saveProgress(currentUser.id, progress);
        renderWins();
      });
    });
  };

  root.querySelectorAll("[data-task]").forEach((checkbox) => {
    checkbox.addEventListener("change", async () => {
      progress.checklist[checkbox.dataset.task] = checkbox.checked;
      await saveProgress(currentUser.id, progress);
    });
  });

  const notesBox = document.querySelector("#notes-box");
  let timeout;
  notesBox.addEventListener("input", (event) => {
    progress.notes = event.target.value;
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      await saveProgress(currentUser.id, progress);
    }, 500);
  });

  document.querySelector("#win-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.querySelector("#win-input");
    if (!input.value.trim()) {
      return;
    }
    progress.wins.unshift(input.value.trim());
    input.value = "";
    await saveProgress(currentUser.id, progress);
    renderWins();
  });

  renderWins();
}

async function renderMentor() {
  const requests = await loadMentorRequests();
  const activeMentees = await loadActiveMentees();
  let users = [];
  try { users = await getAllUsers(); } catch { }

  root.innerHTML = `
    <section class="results-hero compact-hero">
      <div>
        <p class="eyebrow">Mentor workspace</p>
        <h1>${currentUser.name}</h1>
        <p class="lead">Guide returnees with simple, confidence-first coaching.</p>
      </div>
      <div class="score-orb" style="--progress:78">
        <div>
          <span class="score-label">Active</span>
          <strong>${activeMentees.length}</strong>
        </div>
      </div>
    </section>
    <section class="card-grid two">
      <article class="content-card">
        <h2>Mentor requests</h2>
        <ul id="mentor-requests-list" class="interactive-list">
          ${requests.length ? requests.map((item) => `
            <li>
              <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <span>${users.find((user) => user.id === item.userId)?.name || "User"} requested guidance</span>
                <button class="secondary-button" style="padding: 0.2rem 0.6rem; font-size: 0.8rem;" data-accept-request="${item.id}">Accept</button>
              </div>
            </li>`).join("") : "<li>No requests right now</li>"}
        </ul>
      </article>
      <article class="content-card">
        <h2>Your Active Mentees</h2>
        <ul>
          ${activeMentees.length ? activeMentees.map(item => `
            <li><strong>${users.find((user) => user.id === item.userId)?.name || "User"}</strong> — Accepted on ${new Date(item.acceptedAt).toLocaleDateString()}</li>
          `).join("") : "<li>No active mentees yet. Accept a request!</li>"}
        </ul>
      </article>
    </section>
  `;

  root.querySelectorAll("[data-accept-request]").forEach(btn => {
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      await acceptMentorRequest(btn.dataset.acceptRequest);
      renderMentor();
    });
  });
}

async function renderRecruiter() {
  const jobs = await loadJobs();
  const plansObj = await loadAllPlans();
  const plans = plansObj.all || plansObj; // handle format differences

  let users = [];
  try { users = await getAllUsers(); } catch { }

  const allJobStates = await loadAllJobStates();
  const applicants = [];
  Object.entries(allJobStates).forEach(([userId, state]) => {
    if (state && state.applied) {
      state.applied.forEach(jobId => {
        const job = jobs.find(j => j.id === jobId);
        const user = users.find(u => u.id === userId);
        if (job && user) {
          applicants.push({ user, job });
        }
      });
    }
  });

  const candidates = Object.entries(plans)
    .map(([userId, plan]) => ({
      user: users.find((item) => item.id === userId),
      plan,
    }))
    .filter((item) => item.user?.role === "returnee");

  root.innerHTML = `
    <section class="results-hero compact-hero">
      <div>
        <p class="eyebrow">Recruiter workspace</p>
        <h1>${currentUser.name}</h1>
        <p class="lead">Create returnship openings and review comeback-ready talent.</p>
      </div>
      <div class="score-orb" style="--progress:86">
        <div>
          <span class="score-label">Applicants</span>
          <strong>${applicants.length}</strong>
        </div>
      </div>
    </section>
    <section class="card-grid two">
      <article class="content-card">
        <h2>Job Applicants</h2>
        <ul class="interactive-list">${applicants.length ? applicants.map((app) => `<li><strong>${app.user.name}</strong> applied for ${app.job.title}</li>`).join("") : "<li>No applications yet</li>"}</ul>
      </article>
      <article class="content-card">
        <h2>Talent matches</h2>
        <ul>${candidates.length ? candidates.map((item) => `<li><strong>${item.user.name}</strong> • ${item.plan.analysis.role} <span class="pill" style="font-size: 0.7rem; margin-left:8px;">${item.plan.analysis.readinessScore} Readiness</span></li>`).join("") : "<li>No saved returnee plans yet</li>"}</ul>
      </article>
    </section>
    <section class="card-grid two" style="margin-top: 2rem;">
      <article class="content-card">
        <h2>Post a New Opening</h2>
        <form id="recruiter-job-form" style="display: flex; flex-direction: column; gap: 1rem;">
          <input type="text" id="job-title" placeholder="Job Title (e.g. Returnship UI Developer)" required />
          <input type="text" id="job-company" placeholder="Company Name" required />
          <textarea id="job-summary" placeholder="Short description of the role and returnee support..." required></textarea>
          <button type="submit" class="primary-button">Post Job</button>
        </form>
      </article>
      <article class="content-card">
        <h2>Active openings</h2>
        <ul>${jobs.map((job) => `<li><strong>${job.title}</strong> at ${job.company}</li>`).join("")}</ul>
      </article>
    </section>
  `;

  const form = document.querySelector("#recruiter-job-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.querySelector("#job-title").value.trim();
    const company = document.querySelector("#job-company").value.trim();
    const summary = document.querySelector("#job-summary").value.trim();
    const btn = form.querySelector("button");

    if (title && company) {
      btn.disabled = true;
      await addJob({
        title,
        company,
        summary,
        type: "Returnship",
        mode: "Remote",
        location: "Any",
        matchRole: title
      });
      showToast("Job opening posted successfully!", "success");
      renderRecruiter();
    }
  });
}

function routeRole() {
  if (currentUser.role === "mentor") {
    renderMentor();
  } else if (currentUser.role === "recruiter") {
    renderRecruiter();
  } else {
    renderReturnee();
  }
}

routeRole();
window.addEventListener("relaunchher:rerender", routeRole);
