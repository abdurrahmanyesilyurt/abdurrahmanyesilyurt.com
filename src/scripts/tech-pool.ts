// Yetenekler'deki fizikli logo havuzu (matter-js). Logolar yukarıdan düşer, tutulup sürüklenebilir ve
// fırlatılabilir; boş bir yere tıklamak çevredeki logoları havaya sıçratır. Konumlar CSSOM ile
// (style.transform) yazılır; CSP'de 'unsafe-inline' gerekmez. Ekranda değilken simülasyon durur.
import Matter from 'matter-js';

const { Engine, Bodies, Body, Composite, Constraint } = Matter;
const WALL = 400;

export function startPool(container: HTMLElement) {
  const elements = [...container.querySelectorAll<HTMLElement>('[data-pool-item]')].filter((el) => el.offsetParent !== null);
  if (elements.length === 0) return;

  const engine = Engine.create({ gravity: { x: 0, y: 1.1 }, enableSleeping: false });
  let width = container.clientWidth;
  let height = container.clientHeight;

  const wallOptions = { isStatic: true, friction: 0.2, restitution: 0.4 };
  const ground = Bodies.rectangle(width / 2, height + WALL / 2, width * 3, WALL, wallOptions);
  const left = Bodies.rectangle(-WALL / 2, height / 2, WALL, height * 4, wallOptions);
  const right = Bodies.rectangle(width + WALL / 2, height / 2, WALL, height * 4, wallOptions);
  Composite.add(engine.world, [ground, left, right]);

  const items = elements.map((el, i) => {
    const r = el.offsetWidth / 2;
    const x = r + Math.random() * Math.max(1, width - 2 * r);
    const y = -r - i * 26 - Math.random() * 120; // sırayla, üst üste düşsünler
    const body = Bodies.circle(x, y, r, { restitution: 0.55, friction: 0.04, frictionAir: 0.01, density: 0.0018 });
    Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);
    return { el, body, r };
  });
  Composite.add(engine.world, items.map((item) => item.body));
  container.classList.add('is-live');

  const draw = () => {
    for (const { el, body, r } of items) {
      el.style.transform = `translate3d(${(body.position.x - r).toFixed(1)}px, ${(body.position.y - r).toFixed(1)}px, 0) rotate(${body.angle.toFixed(3)}rad)`;
    }
  };

  // ---- Sürükle ve fırlat ------------------------------------------------------------------------
  let drag: { constraint: Matter.Constraint; pointerId: number; el: HTMLElement } | null = null;
  const local = (event: PointerEvent) => {
    const rect = container.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  container.addEventListener('pointerdown', (event) => {
    const point = local(event);
    const hit = items.find(({ el }) => el === event.target || el.contains(event.target as Node));
    if (hit) {
      event.preventDefault();
      hit.el.setPointerCapture(event.pointerId);
      hit.el.classList.add('is-dragging');
      const constraint = Constraint.create({
        pointA: point,
        bodyB: hit.body,
        pointB: { x: point.x - hit.body.position.x, y: point.y - hit.body.position.y },
        stiffness: 0.18,
        damping: 0.08,
        length: 0,
      });
      Composite.add(engine.world, constraint);
      drag = { constraint, pointerId: event.pointerId, el: hit.el };
      return;
    }
    // Boş alana tıklama: yakındaki logolar havaya sıçrar
    for (const { body } of items) {
      const dx = body.position.x - point.x;
      const dy = body.position.y - point.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 180) {
        const force = (1 - distance / 180) * 0.05 * body.mass;
        Body.applyForce(body, body.position, { x: (dx / (distance || 1)) * force, y: -force * 1.6 });
      }
    }
  });

  container.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    drag.constraint.pointA = local(event);
  });

  const release = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    Composite.remove(engine.world, drag.constraint);
    drag.el.classList.remove('is-dragging');
    drag = null;
  };
  container.addEventListener('pointerup', release);
  container.addEventListener('pointercancel', release);

  // ---- Boyut değişimi ----------------------------------------------------------------------------
  new ResizeObserver(() => {
    width = container.clientWidth;
    height = container.clientHeight;
    Body.setPosition(ground, { x: width / 2, y: height + WALL / 2 });
    Body.setPosition(left, { x: -WALL / 2, y: height / 2 });
    Body.setPosition(right, { x: width + WALL / 2, y: height / 2 });
    for (const { body, r } of items) {
      if (body.position.x > width - r) Body.setPosition(body, { x: width - r, y: body.position.y });
    }
  }).observe(container);

  // ---- Döngü: yalnızca görünürken -----------------------------------------------------------------
  let frame = 0;
  let last = 0;
  let running = false;
  const tick = (now: number) => {
    const dt = Math.min(now - last || 16.7, 33);
    last = now;
    Engine.update(engine, dt);
    draw();
    frame = requestAnimationFrame(tick);
  };
  const start = () => {
    if (running) return;
    running = true;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(frame);
  };
  new IntersectionObserver(([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop())).observe(container);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  draw();
  start();
}
