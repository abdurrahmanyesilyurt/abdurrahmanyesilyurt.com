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

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const expandAll = target.closest('[data-expand-all]');
    if (target.closest('[data-theme-toggle]')) {
      const current = root.dataset.theme ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
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

  // Baskıda kapalı kartlar da açık çıksın, sonra eski hâline dönsün
  window.addEventListener('beforeprint', () => {
    for (const item of document.querySelectorAll('details[data-expandable]:not([open])')) {
      item.dataset.printOpened = '';
      item.open = true;
    }
  });
  window.addEventListener('afterprint', () => {
    for (const item of document.querySelectorAll('details[data-print-opened]')) {
      item.open = false;
      delete item.dataset.printOpened;
    }
  });
})();
