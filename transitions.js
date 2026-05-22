/**
 * transitions.js – Smooth page-to-page transitions
 * Uses CSS View Transitions API where supported; falls back to a simple fade.
 */

(function () {
    const INTERNAL_ORIGIN = window.location.origin;

    function isLocalLink(el) {
        if (!el || el.tagName !== "A") return false;
        if (el.target === "_blank") return false;
        if (!el.href) return false;
        try {
            const url = new URL(el.href);
            return url.origin === INTERNAL_ORIGIN && !el.download;
        } catch {
            return false;
        }
    }

    function navigateTo(href) {
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                window.location.href = href;
            });
        } else {
            // Fallback: manual fade-out
            document.documentElement.classList.add("page-leaving");
            setTimeout(() => { window.location.href = href; }, 220);
        }
    }

    document.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!isLocalLink(link)) return;
        // Let go of modified clicks
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigateTo(link.href);
    });

    // Fade in on page load
    document.addEventListener("DOMContentLoaded", () => {
        document.documentElement.classList.add("page-entered");
    });
})();
