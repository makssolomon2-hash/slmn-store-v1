/**
 * Theme Management Script
 * Handles dark/light mode toggling and persistence
 */

const ThemeManager = (() => {
  const THEME_KEY = 'slmn_theme_preference';
  
  // Get preferred theme from local storage or system preferences
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    // Fallback to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Apply theme to the document root
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
  };

  // Initialize theme on load
  const init = () => {
    const initialTheme = getPreferredTheme();
    applyTheme(initialTheme);

    // Setup toggle button listener after DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
      const themeToggleBtn = document.getElementById('theme-toggle');
      if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
      }
    });

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  };

  // Toggle between dark and light mode
  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    applyTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  };

  return { init, toggleTheme };
})();

// Execute immediately to prevent flash of incorrect theme
ThemeManager.init();