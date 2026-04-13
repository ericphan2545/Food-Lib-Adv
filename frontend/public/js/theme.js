// Adapted from NutriPlan/js/theme.js (no module imports)
(function () {
  function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }

  function toggle() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  function bindToggleButton() {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (!toggleBtn) return;
    toggleBtn.addEventListener('click', toggle);
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadSavedTheme();
    bindToggleButton();
  });

  window.toggleTheme = toggle;
})();

