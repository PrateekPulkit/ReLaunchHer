import { analyzeProfile, samplePersonas } from "./logic.js";
import { initShell } from "./shell.js";

initShell();

const filters = document.querySelector("#story-filters");
const grid = document.querySelector("#story-grid");
const detail = document.querySelector("#story-detail");
let activeFilter = "all";

function getPersonas() {
  if (activeFilter === "all") {
    return samplePersonas;
  }
  return samplePersonas.filter((persona) => persona.transitionType === activeFilter);
}

function renderDetail(personaId) {
  const persona = samplePersonas.find((item) => item.id === personaId) || getPersonas()[0];
  const analysis = analyzeProfile(persona);

  detail.innerHTML = `
    <section class="results-hero compact-hero">
      <div>
        <p class="eyebrow">${persona.label}</p>
        <h2>${persona.previousRole} to ${persona.targetRole}</h2>
        <div class="pill-row">
          <span class="pill">${persona.reasonCategory}</span>
          <span class="pill">${analysis.matchPercent}% match</span>
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
        <h3>Top gaps</h3>
        <ul>${analysis.missingSkills.map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>
      <article class="content-card">
        <h3>Opportunities</h3>
        <ul>${analysis.opportunities.slice(0, 4).map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>
    </div>
  `;
}

function renderGrid() {
  const personas = getPersonas();
  grid.innerHTML = personas
    .map(
      (persona) => {
        const analysis = analyzeProfile(persona);
        return `
          <button class="mini-3d-card persona-card story-card" type="button" data-persona="${persona.id}">
            <span class="persona-tag">${persona.label}</span>
            <strong>${persona.previousRole} to ${persona.targetRole}</strong>
            <span>${analysis.readinessScore} readiness</span>
          </button>
        `;
      },
    )
    .join("");

  if (personas[0]) {
    renderDetail(personas[0].id);
  }
}

filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) {
    return;
  }
  activeFilter = button.dataset.filter;
  filters.querySelectorAll("button").forEach((item) => {
    item.classList.toggle("is-active", item === button);
  });
  renderGrid();
});

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-persona]");
  if (!button) {
    return;
  }
  renderDetail(button.dataset.persona);
});

renderGrid();
