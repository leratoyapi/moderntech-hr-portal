(() => {
    const STORAGE_KEY = 'theme';

    function getSavedTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        return savedTheme === 'dark' ? 'dark' : 'light';
    }

    function syncThemeControls(theme) {
        const toggleButton = document.getElementById('darkModeToggle');
        const toggleText = document.getElementById('toggleText');
        const isDark = theme === 'dark';

        if (document.body) {
            document.body.classList.toggle('dark-mode', isDark);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.body?.classList.toggle('dark-mode', isDark);
            }, { once: true });
        }

        if (toggleButton) {
            toggleButton.classList.toggle('dark-mode', isDark);
            toggleButton.setAttribute('aria-pressed', String(isDark));
        }

        if (toggleText) {
            toggleText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        }
    }

    function applyTheme(theme) {
        const resolvedTheme = theme === 'dark' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-bs-theme', resolvedTheme);
        syncThemeControls(resolvedTheme);
        localStorage.setItem(STORAGE_KEY, resolvedTheme);
        return resolvedTheme;
    }

    function initTheme() {
        applyTheme(getSavedTheme());
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme') || getSavedTheme();
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    }

    window.HRTheme = {
        applyTheme,
        getSavedTheme,
        initTheme,
        syncThemeControls,
        toggleTheme
    };

    initTheme();
})();
