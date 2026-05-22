/**
 * toast.js – Lightweight toast notification system for ReLaunchHer
 * Usage: import { showToast } from "./toast.js";
 *        showToast("Saved!", "success");
 *        showToast("Invalid credentials", "error");
 *        showToast("Loading your plan…", "info");
 */

let container = null;

function getContainer() {
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.setAttribute("aria-live", "polite");
        container.setAttribute("aria-atomic", "false");
        document.body.appendChild(container);
    }
    return container;
}

const ICONS = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
};

/**
 * @param {string} message
 * @param {"success"|"error"|"info"} [type="info"]
 * @param {number} [duration=3500]
 */
export function showToast(message, type = "info", duration = 3500) {
    const c = getContainer();
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.setAttribute("role", "status");
    toast.innerHTML = `
    <span class="toast-icon">${ICONS[type] ?? ICONS.info}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Dismiss notification" type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;

    const dismiss = () => {
        toast.classList.add("toast-exit");
        toast.addEventListener("animationend", () => toast.remove(), { once: true });
    };

    toast.querySelector(".toast-close").addEventListener("click", dismiss);
    c.appendChild(toast);

    // auto-dismiss
    const timer = setTimeout(dismiss, duration);
    toast.addEventListener("mouseenter", () => clearTimeout(timer));
    toast.addEventListener("mouseleave", () => setTimeout(dismiss, 1200));
}
