import { registerUser, roles } from "./auth.js";
import { languages, t } from "./i18n.js";
import { initShell } from "./shell.js";
import { showToast } from "./toast.js";

initShell();

const form = document.querySelector("#register-form");
const message = document.querySelector("#auth-message");
const roleSelect = document.querySelector("#role");
const languageSelect = document.querySelector("#language");
const submitBtn = form?.querySelector("button[type=submit]");

function renderSelects() {
  roleSelect.innerHTML = roles
    .map((role) => `<option value="${role.id}">${t(role.labelKey)}</option>`)
    .join("");
  languageSelect.innerHTML = languages
    .map((language) => `<option value="${language.id}">${language.label}</option>`)
    .join("");
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Creating account…"; }

  try {
    await registerUser(data);
    showToast("Account created! Welcome to ReLaunchHer 🌸", "success");
    setTimeout(() => { window.location.href = "./dashboard.html"; }, 900);
  } catch (error) {
    const msg = error.message || t("auth.emailExists");
    if (message) message.textContent = msg;
    showToast(msg, "error");
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Create account"; }
  }
});

window.addEventListener("relaunchher:rerender", renderSelects);
renderSelects();
