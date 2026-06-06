(function () {
  const root = document.body;
  const THEME_KEY = 'cv-theme';

  const applyTheme = (theme) => {
    root.classList.toggle('theme-light', theme === 'light');
  };

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    applyTheme(savedTheme);
  }

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = root.classList.contains('theme-light') ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  const currentYear = document.getElementById('current-year');
  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }

  const printBtn = document.getElementById('print-ats');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const cvContent = document.getElementById('cv-content');
  const searchInput = document.getElementById('cv-search');
  const searchCount = document.getElementById('search-count');
  if (cvContent && searchInput) {
    const searchableNodes = Array.from(
      cvContent.querySelectorAll('p, li, h1, h2, h3')
    ).map((el) => ({ el, original: el.textContent || '' }));

    const highlight = (query) => {
      let matches = 0;
      searchableNodes.forEach(({ el, original }) => {
        if (!query) {
          el.textContent = original;
          return;
        }

        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        if (regex.test(original)) {
          matches += (original.match(regex) || []).length;
          el.innerHTML = original.replace(regex, '<mark class="cv-highlight">$1</mark>');
        } else {
          el.textContent = original;
        }
      });

      if (searchCount) {
        searchCount.textContent = query ? `${matches} coincidencia(s)` : '';
      }
    };

    searchInput.addEventListener('input', (event) => {
      const value = event.target.value.trim();
      highlight(value);
    });
  }

  const copyBtn = document.getElementById('copy-ats');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const atsText = [
        'Cirilo Cardenas Gelves',
        'Analista de Ciberseguridad Jr | Soporte TI | Infraestructura | Gestión de Incidentes',
        'Bogotá, Colombia | profesional.cirilo@gmail.com | https://www.linkedin.com/in/andrestv',
        '',
        'Resumen Profesional:',
        'Profesional orientado a fortalecer la continuidad operativa mediante soporte técnico, gestión de incidencias y acompañamiento a usuarios. Integra ciberseguridad, auditoría y análisis de riesgos para aportar controles preventivos, y optimiza procesos mediante documentación y liderazgo de buenas prácticas.',
        '',
        'Keywords ATS: Ciberseguridad, Soporte TI, Infraestructura, Gestión de Incidentes, Mesa de Ayuda, ITSM, Auditoría de Seguridad, Análisis de Riesgos, Seguridad de la Información, Azure, Power BI, DevOps, Redes, TCP/IP, Hardware, Software, Soporte en Sitio, Soporte Remoto, Documentación Técnica, Continuidad Operativa, Gestión de Activos, Troubleshooting, Windows, Linux, Operaciones de Seguridad, GitHub, Automatización, Seguridad Endpoints, Controles Preventivos.'
      ].join('\n');

      try {
        await navigator.clipboard.writeText(atsText);
        copyBtn.textContent = 'Copiado ✓';
        setTimeout(() => {
          copyBtn.textContent = 'Copiar CV (ATS)';
        }, 1400);
      } catch {
        copyBtn.textContent = 'No se pudo copiar';
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const section = document.querySelector(id);
      if (!section) return;
      event.preventDefault();
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
