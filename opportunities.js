import { loadJobs, loadMentors, loadJobState, toggleSavedJob, applyToJob, requestMentor, addJob } from "./storage.js";
import { initShell } from "./shell.js";
import { t } from "./i18n.js";
import { showToast } from "./toast.js";
import { getAllUsers } from "./auth.js";

const { currentUser } = initShell({ protectedPage: true });
const root = document.querySelector("#opportunities-root");

if (!currentUser) {
  throw new Error("Authentication required");
}

async function renderReturnee() {
  const jobs = await loadJobs();
  const baseMentors = await loadMentors();

  // Try to load extra mentors from users list (mock behavior)
  let allUsers = [];
  try {
    allUsers = await getAllUsers();
  } catch {
    // If not admin/authorized, just fallback
  }

  const registeredMentors = allUsers
    .filter(u => u.role === "mentor" && !baseMentors.find(m => m.mentor_id === u.id))
    .map(u => ({ id: u.id, name: u.name, role: "Registered Mentor", specialty: "Career & Skills Support" }));

  const mentors = [...baseMentors, ...registeredMentors];
  const jobState = await loadJobState(currentUser.id);

  root.innerHTML = `
    <section class="results-hero compact-hero">
      <div>
        <p class="eyebrow" data-i18n="opps.title">${t("opps.title")}</p>
        <h1>Jobs, mentors, and learning</h1>
        <p class="lead" data-i18n="opps.lead">${t("opps.lead")}</p>
      </div>
      <div class="score-orb" style="--progress:84">
        <div>
          <span class="score-label">Options</span>
          <strong>${jobs.length + mentors.length}</strong>
        </div>
      </div>
    </section>

    <section class="card-grid" style="grid-template-columns: 1fr; gap: 1.5rem; max-width: 800px; margin: 0 auto;">
      ${jobs
      .map(
        (job) => `
            <article class="content-card opportunity-card" style="display: flex; flex-direction: column; gap: 1rem; padding: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <h3 style="margin-bottom: 0.25rem; font-size: 1.25rem;">${job.title}</h3>
                  <p style="color: var(--ink); opacity: 0.8; font-weight: 500;">💻 ${job.company}  <span style="margin: 0 0.5rem; opacity: 0.5;">•</span> 📍 ${job.location} <span style="margin: 0 0.5rem; opacity: 0.5;">•</span> 🏢 ${job.mode}</p>
                </div>
                <span class="persona-tag" style="background: var(--primary-light); color: var(--primary);">${job.type}</span>
              </div>
              <p style="line-height: 1.5; font-size: 0.95rem;">${job.summary}</p>
              <div class="hero-actions" style="margin-top: auto; padding-top: 1rem; border-top: 1px solid rgba(0,0,0,0.05);">
                <button class="secondary-button" type="button" data-save-job="${job.id}">
                  ${jobState.saved.includes(job.id) ? t("opps.saved") : "☆ " + t("opps.save")}
                </button>
                <button class="primary-button" type="button" data-apply-job="${job.id}">
                  ${jobState.applied.includes(job.id) ? t("opps.applied") : t("opps.apply")}
                </button>
              </div>
            </article>
          `,
      )
      .join("")}

      <div style="margin-top: 3rem;">
        <h2 style="margin-bottom: 1.5rem;">Available Mentors & Trainers</h2>
        <div class="card-grid two">
          ${mentors
      .map(
        (mentor) => `
                <article class="content-card opportunity-card">
                  <span class="persona-tag">${mentor.role}</span>
                  <h3>${mentor.name}</h3>
                  <p>${mentor.specialty}</p>
                  <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button class="primary-button" type="button" data-mentor="${mentor.id}" style="flex: 1; padding: 0.5rem; font-size: 0.85rem;">Request Mentor</button>
                    <button class="secondary-button" type="button" data-training="${mentor.id}" style="flex: 1; padding: 0.5rem; font-size: 0.85rem;">Request Training</button>
                  </div>
                </article>
              `,
      )
      .join("")}
        </div>
      </div>
    </section>
  `;

  root.querySelectorAll("[data-save-job]").forEach((button) => {
    button.addEventListener("click", async () => {
      button.disabled = true;
      const state = await toggleSavedJob(currentUser.id, button.dataset.saveJob);
      const isSaved = state.saved.includes(button.dataset.saveJob);
      button.disabled = false;
      button.textContent = isSaved ? t("opps.saved") : "☆ " + t("opps.save");
      showToast(isSaved ? "Opportunity saved to your dashboard!" : "Opportunity removed from saved list.", "info");
    });
  });

  root.querySelectorAll("[data-apply-job]").forEach((button) => {
    button.addEventListener("click", async () => {
      const state = await loadJobState(currentUser.id);
      if (state.applied.includes(button.dataset.applyJob)) return; // Already applied

      button.disabled = true;
      await applyToJob(currentUser.id, button.dataset.applyJob);
      button.disabled = false;
      button.textContent = t("opps.applied");
      showToast("Application submitted successfully! Good luck!", "success");
    });
  });

  root.querySelectorAll("[data-mentor]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.textContent === "Requested") return; // already requested
      requestMentor(currentUser.id, button.dataset.mentor, "Mentorship");
      button.textContent = "Requested";
      showToast("Mentor request sent! They will review it shortly.", "success");
    });
  });

  root.querySelectorAll("[data-training]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.textContent === "Requested") return; // already requested
      requestMentor(currentUser.id, button.dataset.training, "Training");
      button.textContent = "Requested";
      showToast("Training request sent! They will review it shortly.", "success");
    });
  });
}

async function renderRecruiter() {
  const jobs = await loadJobs();
  root.innerHTML = `
    <section class="results-hero compact-hero">
      <div>
        <p class="eyebrow">Recruiter tools</p>
        <h1>Post returnship-friendly openings</h1>
        <p class="lead">Keep job cards short, flexible, and returnee-friendly.</p>
      </div>
      <div class="score-orb" style="--progress:88">
        <div>
          <span class="score-label">Live jobs</span>
          <strong>${jobs.length}</strong>
        </div>
      </div>
    </section>
    <section class="card-grid two">
      <article class="content-card">
        <h2>Post a new opening</h2>
        <form id="job-form" class="planner-form">
          <label>Title<input name="title" required /></label>
          <label>Company<input name="company" required /></label>
          <label>Type<input name="type" value="Returnship" required /></label>
          <label>Mode<input name="mode" value="Hybrid" required /></label>
          <label>Location<input name="location" required /></label>
          <label>Role match<input name="matchRole" required /></label>
          <label>Summary<textarea name="summary" rows="4" required></textarea></label>
          <button class="primary-button" type="submit">${t("opps.postJob")}</button>
        </form>
      </article>
      <article class="content-card">
        <h2>Openings</h2>
        <ul id="job-list">${jobs.map((job) => `<li>${job.title} • ${job.company}</li>`).join("")}</ul>
      </article>
    </section>
  `;

  root.querySelector("#job-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const btn = event.currentTarget.querySelector("button");
    btn.disabled = true;
    await addJob(payload);
    btn.disabled = false;
    showToast("Opening posted successfully!", "success");
    renderRecruiter();
  });
}

async function renderMentor() {
  const mentors = await loadMentors();
  root.innerHTML = `
    <section class="results-hero compact-hero">
      <div>
        <p class="eyebrow">Mentor resources</p>
        <h1>Support with clarity and confidence</h1>
        <p class="lead">Use short sessions, checklists, and interview drills.</p>
      </div>
      <div class="score-orb" style="--progress:74">
        <div>
          <span class="score-label">Mentors</span>
          <strong>${mentors.length}</strong>
        </div>
      </div>
    </section>
    <section class="card-grid three">
      <article class="content-card"><h3>Session ideas</h3><ul><li>Resume review</li><li>Interview drill</li><li>Confidence reset</li></ul></article>
      <article class="content-card"><h3>Simple framework</h3><ul><li>What changed</li><li>What remains strong</li><li>What to do next</li></ul></article>
      <article class="content-card"><h3>Best practice</h3><ul><li>Keep advice short</li><li>Use practical examples</li><li>Celebrate small wins</li></ul></article>
    </section>
  `;
}

function routeRole() {
  if (currentUser.role === "recruiter") {
    renderRecruiter();
  } else if (currentUser.role === "mentor") {
    renderMentor();
  } else {
    renderReturnee();
  }
}

routeRole();
window.addEventListener("relaunchher:rerender", routeRole);
