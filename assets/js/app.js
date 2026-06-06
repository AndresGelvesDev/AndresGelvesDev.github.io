(function () {
  const root = document.documentElement;
  const THEME_KEY = 'cv-theme-mode';

  // Función para aplicar tema
  const applyTheme = (theme) => {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      document.body.classList.add('theme-light');
    } else {
      root.setAttribute('data-theme', 'dark');
      document.body.classList.remove('theme-light');
    }
  };

  // Cargar tema guardado o detectar preferencia del sistema
  const loadTheme = () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      applyTheme(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  };

  // Aplicar tema al cargar
  loadTheme();

  // Toggle del tema
  const themeBtn = document.getElementById('btnToggleTheme');
  if (themeBtn) {
    const updateBtnText = () => {
      const isDark = document.body.classList.contains('theme-light') === false;
      themeBtn.textContent = isDark ? '☀️ Claro' : '🌙 Oscuro';
    };

    updateBtnText();

    themeBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('theme-light') === false;
      const newTheme = isDark ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem(THEME_KEY, newTheme);
      updateBtnText();
    });
  }

  // Año dinámico en footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Obfuscación de emails
  const emailLinks = document.querySelectorAll('[data-u][data-d]');
  emailLinks.forEach((el) => {
    const user = el.dataset.u;
    const domain = el.dataset.d;
    const email = `${user}@${domain}`;
    el.textContent = email;
    el.href = `mailto:${email}`;
  });

  // Búsqueda en el CV
  const searchInput = document.getElementById('searchInput');
  const matchInfo = document.getElementById('matchInfo');

  if (searchInput && matchInfo) {
    const allElements = document.querySelectorAll('main h1, main h2, main h3, main p, main li');
    const nodeData = Array.from(allElements).map((el) => ({
      el,
      originalText: el.textContent,
    }));

    const clearHighlights = () => {
      nodeData.forEach(({ el, originalText }) => {
        el.textContent = originalText;
      });
    };

    const highlightMatches = (query) => {
      clearHighlights();

      if (!query.trim()) {
        matchInfo.textContent = '';
        return;
      }

      let totalMatches = 0;
      const lowerQuery = query.toLowerCase();

      nodeData.forEach(({ el, originalText }) => {
        const lowerText = originalText.toLowerCase();

        if (lowerText.includes(lowerQuery)) {
          const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
          const matches = originalText.match(regex) || [];
          totalMatches += matches.length;

          el.innerHTML = originalText.replace(
            regex,
            '<mark>$1</mark>'
          );
        }
      });

      matchInfo.textContent = totalMatches > 0 
        ? `✓ ${totalMatches} coincidencia(s) encontrada(s)` 
        : '✗ Sin coincidencias';
    };

    searchInput.addEventListener('input', (e) => {
      highlightMatches(e.target.value);
    });
  }

  // Scroll suave para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
