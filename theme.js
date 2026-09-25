// ==========================================
// TROPIGO THEME MANAGER (Light / Dark)
// ==========================================
(function () {
    'use strict';
    
    const THEME_KEY = 'tropigo_theme';
    const html = document.documentElement;

    // ---------- Load saved theme or system preference ----------
    function getInitialTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark') return saved;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // ---------- Update all toggle buttons ----------
    function updateAllToggles(theme) {
        document.querySelectorAll('.theme-toggle').forEach(function (btn) {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
            btn.setAttribute('aria-label',
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        });
    }

    // ---------- Apply theme ----------
    function applyTheme(theme) {
        if (theme === 'dark') {
            html.setAttribute('data-theme', 'dark');
        } else {
            html.removeAttribute('data-theme');
        }
        localStorage.setItem(THEME_KEY, theme);
        updateAllToggles(theme);
    }

    // ---------- Apply immediately (no flash) ----------
    applyTheme(getInitialTheme());

    // ---------- Toggle on click (event delegation) ----------
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.theme-toggle');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        
        const current = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const newTheme = current === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    // ---------- Re-apply icon state after DOM loads ----------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            const current = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            updateAllToggles(current);
        });
    } else {
        // DOM already loaded
        const current = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        updateAllToggles(current);
    }

    // ---------- Listen for OS theme change ----------
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            if (!localStorage.getItem(THEME_KEY)) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // ---------- Expose for debugging ----------
    window.TropiGoTheme = {
        apply: applyTheme,
        get: function () {
            return html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        }
    };
})();