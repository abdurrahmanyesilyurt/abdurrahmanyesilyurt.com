// .glow-card kartları: imlecin kart içindeki yeri (--mx/--my) kenar ve spot ışığını sürer; kapalı
// kartlar imlece doğru hafifçe eğilir (--rx/--ry). Yalnızca fare/kalem; dokunmatikte ve "hareketi
// azalt" açıkken eğim yok. Stil özelliği değil CSSOM kullanılır (CSP'de 'unsafe-inline' gerekmez).
const MAX_TILT = 5; // derece

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let current: HTMLElement | null = null;

function reset(card: HTMLElement) {
  card.style.setProperty('--rx', '0deg');
  card.style.setProperty('--ry', '0deg');
}

document.addEventListener(
  'pointermove',
  (event) => {
    if (event.pointerType === 'touch') return;
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('.glow-card') : null;
    if (current && current !== target) reset(current);
    current = target;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    target.style.setProperty('--mx', `${x}px`);
    target.style.setProperty('--my', `${y}px`);

    // Açık (uzun) kartlar eğilmez; okunurken sallanmasın
    if (reduced.matches || (target instanceof HTMLDetailsElement && target.open)) {
      reset(target);
      return;
    }
    const px = x / rect.width - 0.5;
    const py = y / rect.height - 0.5;
    target.style.setProperty('--rx', `${(-py * MAX_TILT).toFixed(2)}deg`);
    target.style.setProperty('--ry', `${(px * MAX_TILT).toFixed(2)}deg`);
  },
  { passive: true },
);

document.addEventListener('pointerleave', () => {
  if (current) reset(current);
  current = null;
});
