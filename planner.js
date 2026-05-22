import { analyzeProfile, getPersonaById, samplePersonas } from "./logic.js";
import { savePlan } from "./storage.js";
import { initShell } from "./shell.js";

const { currentUser } = initShell({ protectedPage: true });

if (!currentUser) {
  throw new Error("Authentication required");
}

const form = document.querySelector("#planner-form");
const results = document.querySelector("#planner-results");
const personaStrip = document.querySelector("#persona-strip");
const stepPanels = [...document.querySelectorAll(".step-panel")];
const stepDots = [...document.querySelectorAll(".step-dot")];
const stepLabels = [...document.querySelectorAll(".step-label-row span")];
const progressFill = document.querySelector("#progress-fill");
const prevButton = document.querySelector("#prev-step");
const nextButton = document.querySelector("#next-step");
const submitButton = document.querySelector("#submit-plan");
const feedback = document.querySelector("#save-feedback");
const confidenceInput = document.querySelector("#confidenceLevel");
const confidenceValue = document.querySelector("#confidenceValue");
let currentStep = 0;

const TOTAL_STEPS = stepPanels.length;

// All form fields across all 4 steps
const fields = [
  "previousRole", "yearsExperience", "careerBreakYears", "reasonCategory",
  "previousIndustry", "educationLevel", "leadershipExperience",
  "targetRole", "transitionType", "skills", "certificationsHeld",
  "workArrangement", "employmentType",
  "confidenceLevel", "weeklyHours", "networkingStatus", "profileStatus",
  "skillCurrency", "topBlocker",
  "targetTimeline", "salaryExpectation", "successDefinition",
  "supportSystem", "companyPreference",
];

function syncConfidenceValue() {
  confidenceValue.textContent = confidenceInput.value;
}

function populateForm(profile) {
  fields.forEach((field) => {
    const el = form.elements[field];
    if (!el) return;
    el.value = profile[field] ?? "";
  });
  syncConfidenceValue();
}

function getProfile() {
  return Object.fromEntries(new FormData(form).entries());
}

function renderPersonas() {
  personaStrip.innerHTML = samplePersonas
    .map(
      (persona) => `
        <button class="mini-3d-card persona-card compact" type="button" data-persona="${persona.id}">
          <span class="persona-tag">${persona.label}</span>
          <strong>${persona.previousRole}</strong>
          <span>${persona.careerBreakYears} yr break → ${persona.targetRole}</span>
        </button>
      `,
    )
    .join("");
}

function validateStep() {
  const panel = stepPanels[currentStep];
  const items = [...panel.querySelectorAll("input[required], select[required], textarea[required]")];
  const invalid = items.find((item) => !item.checkValidity());
  if (invalid) {
    invalid.reportValidity();
    return false;
  }
  return true;
}

function updateWizard() {
  stepPanels.forEach((panel, index) => {
    panel.hidden = index !== currentStep;
  });
  stepDots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === currentStep);
    dot.classList.toggle("is-complete", index < currentStep);
  });
  stepLabels.forEach((lbl, index) => {
    lbl.classList.toggle("active-label", index === currentStep);
  });
  progressFill.style.width = `${((currentStep + 1) / TOTAL_STEPS) * 100}%`;
  prevButton.hidden = currentStep === 0;
  nextButton.hidden = currentStep === TOTAL_STEPS - 1;
  submitButton.hidden = currentStep !== TOTAL_STEPS - 1;
}

// ─────────────────────────────────────────────
// RESULT RENDERER — rich, personalized output
// ─────────────────────────────────────────────
function demandBadge(level) {
  const map = {
    "very-high": { label: "Very High Demand ↑↑", cls: "pill green" },
    "high": { label: "High Demand ↑", cls: "pill green" },
    "moderate": { label: "Moderate Demand", cls: "pill" },
    "low": { label: "Niche Market", cls: "pill" },
  };
  const d = map[level] || map.moderate;
  return `<span class="${d.cls}">${d.label}</span>`;
}

function salaryBadge(range) {
  if (!range) return "";
  return `<span class="pill">Salary: $${(range.min / 1000).toFixed(0)}k–$${(range.max / 1000).toFixed(0)}k</span>`;
}

async function renderResults(profile) {
  const analysis = analyzeProfile(profile);
  await savePlan(currentUser.id, profile, analysis);
  feedback.textContent = "✓ Saved to dashboard.";

  results.innerHTML = `
    <!-- Hero -->
    <section class="results-hero compact-hero">
      <div>
        <p class="eyebrow">Plan snapshot</p>
        <h2>${analysis.role}</h2>
        <div class="pill-row">
          <span class="pill">${analysis.matchLabel}</span>
          <span class="pill">${analysis.matchPercent}% skill match</span>
          ${demandBadge(analysis.demandLevel)}
          ${salaryBadge(analysis.salaryRange)}
        </div>
        <p style="font-size:0.83rem;color:var(--text-muted);margin-top:10px;line-height:1.55;max-width:540px;">${analysis.narrativeSummary}</p>
      </div>
      <div class="score-orb" style="--progress:${analysis.readinessScore}">
        <div>
          <span class="score-label">Readiness</span>
          <strong>${analysis.readinessScore}</strong>
        </div>
      </div>
    </section>

    <!-- Next milestone highlight -->
    <div class="content-card" style="border-left:3px solid var(--accent);padding:14px 18px;margin-bottom:20px;">
      <p style="font-size:0.76rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--accent);margin-bottom:4px;">Your Next Milestone</p>
      <p style="font-size:0.9rem;line-height:1.5;margin:0;">${analysis.nextMilestone}</p>
    </div>

    <!-- Strengths / Gaps / Opportunities -->
    <div class="card-grid three">
      <article class="content-card">
        <h3>Transferable Strengths</h3>
        <div class="chip-row">${analysis.transferables.slice(0, 6).map((item) => `<span class="soft-chip">${item}</span>`).join("")}</div>
        <p style="font-size:0.77rem;color:var(--text-muted);margin-top:10px;line-height:1.5;">${analysis.strengthsNarrative}</p>
      </article>
      <article class="content-card">
        <h3>Skills to Close First</h3>
        ${analysis.missingSkills.length === 0
          ? `<p style="color:var(--text-muted);font-size:0.85rem;">All required skills matched! Focus on nice-to-have gaps below.</p>`
          : `<ul>${analysis.missingSkills.map((item) => `<li><strong>${item}</strong></li>`).join("")}</ul>`}
        ${analysis.bonusSkills.length
          ? `<p style="font-size:0.78rem;color:var(--text-muted);margin-top:8px;">✓ Bonus: ${analysis.bonusSkills.join(", ")}</p>`
          : ""}
      </article>
      <article class="content-card">
        <h3>Opportunities to Target</h3>
        <ul>${analysis.opportunities.slice(0, 5).map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>
    </div>

    <!-- Industry signals -->
    <article class="content-card" style="margin-bottom:20px;">
      <h3>What the Market Is Saying Right Now</h3>
      <ul>${analysis.industrySignals.map((s) => `<li>${s}</li>`).join("")}</ul>
    </article>

    <!-- Weekly sprint + Confidence plan -->
    <div class="card-grid two">
      <article class="content-card">
        <h3>This Week's Sprint</h3>
        <p style="font-size:0.77rem;color:var(--text-muted);margin-bottom:10px;">Personalized to your blockers, available time, and skill gaps.</p>
        <ol>${analysis.weeklySprint.map((item) => `<li>${item}</li>`).join("")}</ol>
      </article>
      <article class="content-card">
        <h3>Confidence-First Plan</h3>
        <p style="font-size:0.77rem;color:var(--text-muted);margin-bottom:10px;">Tailored to your confidence score and biggest current blocker.</p>
        <ul>${analysis.confidencePlan.map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>
    </div>

    <!-- Encouragement nudges -->
    <div class="content-card" style="background:linear-gradient(135deg,var(--surface-raised,#fff5f8),var(--surface,#fff));margin-bottom:20px;">
      <h3>A Word of Encouragement</h3>
      ${analysis.encouragement.map((n) => `<p style="margin-bottom:8px;font-size:0.88rem;line-height:1.55;">💜 ${n}</p>`).join("")}
    </div>

    <!-- 30/60/90 Roadmap -->
    <section class="timeline-shell">
      <div class="section-heading compact-heading" style="margin-bottom:18px;">
        <p class="eyebrow">Sprint roadmap</p>
        <h3>Your 30 / 60 / 90 Day Plan</h3>
        <p style="font-size:0.82rem;color:var(--text-muted);">Adapted to your timeline, available hours, and transition type.</p>
      </div>
      <div class="timeline">
        ${analysis.roadmap
          .map(
            (phase) => `
              <article class="timeline-step">
                <span class="timeline-badge">${phase.phase}</span>
                <h3>${phase.focus}</h3>
                <ul>${phase.actions.map((item) => `<li>${item}</li>`).join("")}</ul>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>

    <!-- Learning plan: courses + certs -->
    <section class="card-grid two" style="margin-top:24px;">
      <article class="content-card">
        <h3>Recommended Courses</h3>
        <ul>${analysis.learningPlan.filter((i) => i.type === "Course").map((i) => `<li>${i.name}</li>`).join("")}</ul>
      </article>
      <article class="content-card">
        <h3>Certifications to Target</h3>
        <ul>${analysis.learningPlan.filter((i) => i.type === "Certification").map((i) => `<li>${i.name}</li>`).join("")}</ul>
      </article>
    </section>

    <!-- Interview prep -->
    <article class="content-card" style="margin-top:20px;">
      <h3>Interview Questions to Practice</h3>
      <p style="font-size:0.77rem;color:var(--text-muted);margin-bottom:12px;">Role-specific questions curated for your target position — practice these until they feel natural.</p>
      <ol>${analysis.interviewPrompts.map((q) => `<li style="margin-bottom:8px;">${q}</li>`).join("")}</ol>
    </article>
  `;

  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─────────────────────────────────────────────
// EVENT LISTENERS
// ─────────────────────────────────────────────
personaStrip.addEventListener("click", (event) => {
  const button = event.target.closest("[data-persona]");
  if (!button) return;
  const persona = getPersonaById(button.dataset.persona);
  if (!persona) return;
  populateForm(persona);
  currentStep = 0;
  updateWizard();
  renderResults(persona);
});

prevButton.addEventListener("click", () => {
  currentStep = Math.max(0, currentStep - 1);
  updateWizard();
});

nextButton.addEventListener("click", () => {
  if (!validateStep()) return;
  currentStep = Math.min(TOTAL_STEPS - 1, currentStep + 1);
  updateWizard();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateStep()) return;
  renderResults(getProfile());
});

confidenceInput.addEventListener("input", syncConfidenceValue);

window.addEventListener("relaunchher:rerender", () => {
  if (results.innerHTML.trim()) {
    renderResults(getProfile());
  }
});

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
renderPersonas();
populateForm(samplePersonas[0]);
renderResults(samplePersonas[0]);
updateWizard();
