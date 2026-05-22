import { loginUser } from "./auth.js";
import { initShell } from "./shell.js";
import { t } from "./i18n.js";
import { showToast } from "./toast.js";

initShell();

const form = document.querySelector("#login-form");
const message = document.querySelector("#auth-message");
const submitBtn = form?.querySelector("button[type=submit]");
const params = new URLSearchParams(window.location.search);
const next = params.get("next") || "dashboard.html";

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Signing in…"; }

  try {
    await loginUser(data.email, data.password);
    showToast("Welcome back! 🌸 Redirecting…", "success");
    setTimeout(() => { window.location.href = `./${next}`; }, 900);
  } catch (error) {
    const msg = error.message || t("auth.invalidCredentials");
    if (message) message.textContent = msg;
    showToast(msg, "error");
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Sign in"; }
  }
});
