/**
 * theme.js – Dark / light mode toggle with OS preference detection
 * Call initTheme() early in each page's module script.
 */

const THEME_KEY = "relaunchher.theme";

export function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    // Update any toggle buttons
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
        btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
        btn.setAttribute("data-theme", theme);
    });
}

export function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    applyTheme(current === "dark" ? "light" : "dark");
}

export function initTheme() {
    applyTheme(getPreferredTheme());
    // Respond to OS-level changes when no manual preference is set
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
            applyTheme(e.matches ? "dark" : "light");
        }
    });
}
