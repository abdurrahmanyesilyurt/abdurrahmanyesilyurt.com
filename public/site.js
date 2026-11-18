// Sayfanın <head> kısmında, boyamadan önce çalışır.
// Satır içi script yerine harici dosya: sıkı CSP (script-src 'self') ile uyumlu.
(() => {
  const root = document.documentElement;

  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  } catch {}

  const expandables = (scope) => [...scope.querySelectorAll('details[data-expandable]')];

  // "Tümünü aç / kapat" düğmesinin yazısını kartların durumuna göre güncelle
  const syncExpandButtons = () => {
    for (const button of document.querySelectorAll('[data-expand-all]')) {
      const items = expandables(button.closest('section') ?? document);
      const allOpen = items.length > 0 && items.every((item) => item.open);
      button.setAttribute('aria-expanded', String(allOpen));
      button.textContent = allOpen ? button.dataset.labelClose : button.dataset.labelOpen;
    }
  };

  // Ana bölümler: başlıktaki düğme bölümü kapatıp açar. Kapalı bölümün içeriği "inert" olur (sekmeyle
  // içine girilmez); kapanma animasyonu bitene kadar "is-animating" taşmayı gizler.
  const setSection = (section, open) => {
    const button = section.querySelector('[data-section-toggle]');
    const body = section.querySelector('[data-section-body]');
    if (!button || !body || section.classList.contains('is-collapsed') !== open) return;
    section.classList.add('is-animating');
    section.classList.toggle('is-collapsed', !open);
    button.setAttribute('aria-expanded', String(open));
    body.inert = !open;
    window.clearTimeout(Number(section.dataset.timer));
    section.dataset.timer = String(window.setTimeout(() => section.classList.remove('is-animating'), 500));
  };

  // Kapalı bir bölüme (ya da içindeki bir yere) giden link bölümü açar
  const openSectionFor = (hash) => {
    if (!hash || hash === '#') return;
    let target = null;
    try {
      target = document.querySelector(hash);
    } catch {}
    const section = target?.closest('[data-section]');
    if (section) setSection(section, true);
  };

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const sectionToggle = target.closest('[data-section-toggle]');
    const hashLink = target.closest('a[href^="#"]');
    if (sectionToggle) {
      const section = sectionToggle.closest('[data-section]');
      if (section) setSection(section, section.classList.contains('is-collapsed'));
      return;
    }
    if (hashLink) openSectionFor(hashLink.hash);

    const expandAll = target.closest('[data-expand-all]');
    if (target.closest('[data-theme-toggle]')) {
      // Site koyu öncelikli: kayıtlı tercih yoksa koyu temadayız
      const current = root.dataset.theme ?? 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch {}
    } else if (target.closest('[data-print]')) {
      window.print();
    } else if (expandAll) {
      const items = expandables(expandAll.closest('section') ?? document);
      const open = items.some((item) => !item.open);
      for (const item of items) item.open = open;
    }
  });

  // "toggle" olayı kabarcıklanmaz; yakalama aşamasında dinlenir
  document.addEventListener(
    'toggle',
    (event) => {
      if (event.target instanceof HTMLDetailsElement && event.target.matches('[data-expandable]')) syncExpandButtons();
    },
    true,
  );

  window.addEventListener('hashchange', () => openSectionFor(location.hash));

  // Baskıda kapalı kartlar ve bölümler de açık çıksın, sonra eski hâline dönsün
  window.addEventListener('beforeprint', () => {
    for (const item of document.querySelectorAll('details[data-expandable]:not([open])')) {
      item.dataset.printOpened = '';
      item.open = true;
    }
    for (const section of document.querySelectorAll('[data-section].is-collapsed')) {
      section.dataset.printOpened = '';
      setSection(section, true);
    }
  });
  window.addEventListener('afterprint', () => {
    for (const item of document.querySelectorAll('details[data-print-opened]')) {
      item.open = false;
      delete item.dataset.printOpened;
    }
    for (const section of document.querySelectorAll('[data-section][data-print-opened]')) {
      setSection(section, false);
      delete section.dataset.printOpened;
    }
  });
})();
