// Sayfanın <head> kısmında, boyamadan önce çalışır.
// Satır içi script yerine harici dosya: sıkı CSP (script-src 'self') ile uyumlu.
(() => {
  const root = document.documentElement;

  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  } catch {}

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    if (target.closest('[data-theme-toggle]')) {
      const current = root.dataset.theme ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = current === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch {}
    } else if (target.closest('[data-print]')) {
      window.print();
    }
  });
})();
