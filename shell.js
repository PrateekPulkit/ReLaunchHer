import { getCurrentUser, fetchCurrentUser, logoutUser, roles, updateUser } from "./auth.js";
import { applyTranslations, getLanguage, languages, setLanguage, t } from "./i18n.js";
import { initTheme, toggleTheme } from "./theme.js";

// ── Theme init (must be first) ──────────────────────────────────────────────
initTheme();

function getRoleLabel(roleId, language) {
  const role = roles.find((item) => item.id === roleId);
  return role ? t(role.labelKey, language) : roleId;
}

// ── Glossy Language Dock ────────────────────────────────────────────────────
function buildLangDock(selectedLang, onChangeFn) {
  // Remove any existing dock
  document.getElementById("lang-dock")?.remove();

  const dock = document.createElement("div");
  dock.id = "lang-dock";
  dock.setAttribute("aria-label", "Language selector dock");

  const current = languages.find((l) => l.id === selectedLang) || languages[0];

  dock.innerHTML = `
    <div id="lang-dock-inner">
      <button id="lang-dock-trigger" class="lang-dock-trigger" aria-haspopup="listbox" aria-expanded="false" aria-controls="lang-dock-list" type="button">
        <span class="lang-globe" aria-hidden="true">🌐</span>
        <span class="lang-label">${current.label}</span>
        <span class="lang-chevron" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
      </button>
      <ul id="lang-dock-list" class="lang-dock-list" role="listbox" aria-label="Select language" tabindex="-1">
        ${languages.map((lang) => `
          <li role="option" class="lang-option${lang.id === selectedLang ? " is-selected" : ""}" data-lang="${lang.id}" aria-selected="${lang.id === selectedLang}" tabindex="0">
            <span class="lang-option-flag">${lang.flag ?? "🌍"}</span>
            <span>${lang.label}</span>
          </li>
        `).join("")}
      </ul>
    </div>
    <button id="theme-toggle-btn" class="theme-toggle lang-dock-trigger" type="button" aria-label="Toggle dark mode" title="Toggle dark/light mode">
      <span class="theme-icon-light" aria-hidden="true">☀️</span>
      <span class="theme-icon-dark" aria-hidden="true">🌙</span>
    </button>
  `;

  document.body.appendChild(dock);

  // ── Trigger open/close ────────────────────────────────────────────────────
  const trigger = dock.querySelector("#lang-dock-trigger");
  const list = dock.querySelector("#lang-dock-list");
  const themeBtn = dock.querySelector("#theme-toggle-btn");

  function openList() {
    list.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    list.focus();
  }
  function closeList() {
    list.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  }

  trigger.addEventListener("click", () => {
    list.classList.contains("is-open") ? closeList() : openList();
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!dock.contains(e.target)) closeList();
  });

  // ── Option selection ──────────────────────────────────────────────────────
  list.addEventListener("click", (e) => {
    const option = e.target.closest(".lang-option");
    if (!option) return;
    const lang = option.dataset.lang;
    closeList();
    onChangeFn(lang);
    // Update labels
    const found = languages.find((l) => l.id === lang);
    if (found) dock.querySelector(".lang-label").textContent = found.label;
    // Update aria-selected
    list.querySelectorAll(".lang-option").forEach((el) => {
      el.classList.toggle("is-selected", el.dataset.lang === lang);
      el.setAttribute("aria-selected", el.dataset.lang === lang);
    });
  });

  // Keyboard nav in list
  list.addEventListener("keydown", (e) => {
    const opts = [...list.querySelectorAll(".lang-option")];
    const idx = opts.findIndex((el) => el === document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); opts[(idx + 1) % opts.length]?.focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); opts[(idx - 1 + opts.length) % opts.length]?.focus(); }
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); document.activeElement.click(); }
    if (e.key === "Escape") { closeList(); trigger.focus(); }
  });

  // ── Theme toggle ──────────────────────────────────────────────────────────
  themeBtn.addEventListener("click", toggleTheme);
}

// ── Main shell init ─────────────────────────────────────────────────────────
export function initShell({ protectedPage = false } = {}) {
  const currentUser = getCurrentUser();
  const language = currentUser?.language || getLanguage();
  applyTranslations(document, language);

  const authSlot = document.querySelector("#auth-slot");

  const renderAuthSlot = (activeLanguage) => {
    if (!authSlot) return;
    const sessionUser = getCurrentUser();
    if (sessionUser) {
      authSlot.innerHTML = `
        <div class="auth-chip">
          <span>${sessionUser.name}</span>
          <small>${getRoleLabel(sessionUser.role, activeLanguage)}</small>
        </div>
        <a class="secondary-button" href="./dashboard.html">${t("nav.openDashboard", activeLanguage)}</a>
        <button id="logout-button" class="secondary-button" type="button">${t("nav.logout", activeLanguage)}</button>
      `;
      authSlot.querySelector("#logout-button").addEventListener("click", async () => {
        await logoutUser();
        window.location.href = "./index.html";
      });
      return;
    }
    authSlot.innerHTML = `
      <a class="secondary-button" href="./login.html">${t("nav.login", activeLanguage)}</a>
      <a class="primary-button" href="./register.html">${t("nav.register", activeLanguage)}</a>
    `;
  };

  // Language change callback
  const onLangChange = (nextLanguage) => {
    setLanguage(nextLanguage);
    const user = getCurrentUser();
    if (user) updateUser(user.id, { language: nextLanguage });
    applyTranslations(document, nextLanguage);
    renderAuthSlot(nextLanguage);
    window.dispatchEvent(new CustomEvent("relaunchher:rerender", { detail: nextLanguage }));
    // Rebuild dock to update selection state
    buildLangDock(nextLanguage, onLangChange);
  };

  // Build glossy dock
  buildLangDock(language, onLangChange);

  renderAuthSlot(language);

  // Focus UI based on roles by hiding irrelevant links
  if (currentUser && (currentUser.role === "mentor" || currentUser.role === "recruiter")) {
    document.querySelectorAll(".main-nav .nav-link").forEach(link => {
      if (link.getAttribute("href") === "./planner.html") {
        link.style.display = "none";
      }
    });
  }

  if (protectedPage && !currentUser) {
    // Validate against server (session cookie may still be valid even if cache is empty)
    fetchCurrentUser().then((serverUser) => {
      if (!serverUser) {
        const next = encodeURIComponent(window.location.pathname.replace(/^\//, "") || "dashboard.html");
        window.location.href = `./login.html?next=${next}`;
      }
    });
    if (!currentUser) {
      const next = encodeURIComponent(window.location.pathname.replace(/^\//, "") || "dashboard.html");
      window.location.href = `./login.html?next=${next}`;
      return { currentUser: null, language };
    }
  }

  return { currentUser, language };
}
