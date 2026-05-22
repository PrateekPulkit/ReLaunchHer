import { initShell } from "./shell.js";
import { analyzeProfile, samplePersonas } from "./logic.js";

const { currentUser } = initShell();

const spotlightButtons = document.querySelector("#spotlight-buttons");
const spotlightPanel = document.querySelector("#spotlight-panel");
const demoStats = document.querySelector("#demo-stats");
const primaryCta = document.querySelector("#hero-primary-cta");
const secondaryCta = document.querySelector("#hero-secondary-cta");
let activePersonaId = samplePersonas[0].id;

function configureCtas() {
  if (currentUser) {
    primaryCta.href = "./planner.html";
    primaryCta.textContent = "Open planner";
    secondaryCta.href = "./dashboard.html";
    secondaryCta.textContent = "Open dashboard";
    return;
  }

  primaryCta.href = "./register.html";
  primaryCta.textContent = "Create free account";
  secondaryCta.href = "./login.html";
  secondaryCta.textContent = "Login to unlock tools";
}

function renderStats() {
  const analyses = samplePersonas.map((persona) => analyzeProfile(persona));
  const averageReadiness = Math.round(
    analyses.reduce((sum, item) => sum + item.readinessScore, 0) / analyses.length,
  );

  demoStats.innerHTML = `
    <article class="mini-3d-card">
      <span class="mini-label">Readiness</span>
      <strong>${averageReadiness}</strong>
      <p>Average score across built-in comeback examples.</p>
    </article>
    <article class="mini-3d-card">
      <span class="mini-label">Roles</span>
      <strong>3</strong>
      <p>Returnee, mentor, and recruiter experiences.</p>
    </article>
    <article class="mini-3d-card">
      <span class="mini-label">Languages</span>
      <strong>7</strong>
      <p>English, Hindi, Telugu, Malayalam, Tamil, Odia, and Bangla.</p>
    </article>
  `;
}

function renderSpotlight(personaId) {
  activePersonaId = personaId;
  const persona = samplePersonas.find((item) => item.id === personaId) || samplePersonas[0];
  const analysis = analyzeProfile(persona);

  spotlightPanel.innerHTML = `
    <section class="results-hero compact-hero">
      <div>
        <p class="eyebrow">${persona.label}</p>
        <h2>${persona.previousRole} to ${persona.targetRole}</h2>
        <div class="pill-row">
          <span class="pill">${persona.careerBreakYears} year break</span>
          <span class="pill">${analysis.matchLabel}</span>
        </div>
      </div>
      <div class="score-orb" style="--progress:${analysis.readinessScore}">
        <div>
          <span class="score-label">Readiness</span>
          <strong>${analysis.readinessScore}</strong>
        </div>
      </div>
    </section>
    <div class="card-grid two">
      <article class="content-card">
        <h3>Priority skills</h3>
        <ul>${analysis.missingSkills.map((skill) => `<li>${skill}</li>`).join("")}</ul>
      </article>
      <article class="content-card">
        <h3>Best next move</h3>
        <p>${analysis.nextMilestone}</p>
      </article>
    </div>
  `;

  spotlightButtons.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.persona === persona.id);
  });
}

spotlightButtons.innerHTML = samplePersonas
  .map(
    (persona) => `
      <button type="button" data-persona="${persona.id}" class="filter-button">
        ${persona.label}
      </button>
    `,
  )
  .join("");

spotlightButtons.addEventListener("click", (event) => {
  const button = event.target.closest("[data-persona]");
  if (!button) {
    return;
  }

  renderSpotlight(button.dataset.persona);
});

window.addEventListener("relaunchher:rerender", () => {
  renderStats();
  renderSpotlight(activePersonaId);
});

configureCtas();
renderStats();
renderSpotlight(samplePersonas[0].id);
