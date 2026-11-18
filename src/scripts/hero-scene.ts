// Hero'daki 3D sahne: kapağı açılan bir dizüstü (ekranında kod yazılıyor), çerçeveli portre, kupa ve
// etrafında dönen teknoloji logoları. Sayfa yüklendikten sonra dinamik import ile gelir; WebGL yoksa
// createHeroScene null döner ve sayfadaki portre yedeği yerinde kalır.
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  CanvasTexture,
  CircleGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Raycaster,
  SRGBColorSpace,
  Scene,
  TextureLoader,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Object3D,
  type Texture,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export interface SceneIcon {
  title: string;
  hex: string;
  path: string;
  glyph: string;
}

/** Sahnedeki tıklanabilir nesnelerin işi: çerçeve portreyi öne getirir, diğerleri bölüme götürür */
export type SceneAction = 'portrait' | 'projects' | 'skills' | 'experience' | 'contact';

export interface SceneData {
  portrait: string;
  icons: SceneIcon[];
  name: string;
  role: string;
  stack: string[];
  openToWork: boolean;
  /** Nesnelerin üzerine gelince çıkan etiketler */
  labels: Record<SceneAction, string>;
}

interface Options {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  data: SceneData;
  reducedMotion: boolean;
  /** Sahnedeki bir nesne tıklandı */
  onAction: (action: SceneAction) => void;
}

export interface HeroScene {
  /** Çerçeve masadan kalkıp kameraya doğru uçar (true) ya da yerine döner (false) */
  focusPortrait(on: boolean): void;
  /** Nesnenin üstündeki noktaya gelinince nesne hafifçe kalkar */
  highlight(action: SceneAction | null): void;
  dispose(): void;
}

const ACTIONS: SceneAction[] = ['portrait', 'projects', 'skills', 'experience', 'contact'];

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

// ---- Ekran: VS Code benzeri bir editörde kod yazılır -------------------------------------------

type Token = { text: string; color: string };

const COLORS = {
  bg: '#0b0e1a',
  bar: '#121628',
  gutter: '#4b5270',
  text: '#d7dcf0',
  keyword: '#c49bff',
  string: '#7fe0ae',
  comment: '#5d6688',
  type: '#7cc4ff',
  number: '#ffb36b',
  punct: '#8f97b8',
};

function tokenize(line: string): Token[] {
  if (line.trimStart().startsWith('//')) return [{ text: line, color: COLORS.comment }];
  const tokens: Token[] = [];
  const re = /("(?:[^"\\]|\\.)*"|\b(?:var|new|true|false|await|async|return|const)\b|\b[A-Z][A-Za-z]+\b|\b\d+\b|[{}()[\],.;=>]+|\s+|[^\s"{}()[\],.;=>]+)/g;
  for (const match of line.matchAll(re)) {
    const text = match[0];
    let color = COLORS.text;
    if (text.startsWith('"')) color = COLORS.string;
    else if (/^(var|new|true|false|await|async|return|const)$/.test(text)) color = COLORS.keyword;
    else if (/^[A-Z]/.test(text)) color = COLORS.type;
    else if (/^\d+$/.test(text)) color = COLORS.number;
    else if (/^[{}()[\],.;=>]+$/.test(text)) color = COLORS.punct;
    tokens.push({ text, color });
  }
  return tokens;
}

function codeLines(data: SceneData): string[] {
  const stack = data.stack.map((item) => `"${item}"`).join(', ');
  return [
    '// abdurrahmanyesilyurt.com',
    'var builder = WebApplication.CreateBuilder(args);',
    'builder.Services.AddDbContext<AppDb>(o => o.UseNpgsql(db));',
    'var app = builder.Build();',
    '',
    'app.MapGet("/api/me", () => new {',
    `    name = "${data.name}",`,
    `    role = "${data.role}",`,
    `    stack = [${stack}],`,
    `    openToWork = ${data.openToWork},`,
    '});',
    '',
    'app.Run();',
  ];
}

class CodeScreen {
  readonly texture: CanvasTexture;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly lines: Token[][];
  private readonly total: number;
  private shown = -1;

  constructor(data: SceneData) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    this.ctx = canvas.getContext('2d')!;
    this.lines = codeLines(data).map(tokenize);
    this.total = this.lines.reduce((sum, line) => sum + line.reduce((n, t) => n + t.text.length, 0) + 1, 0);
    this.texture = new CanvasTexture(canvas);
    this.texture.colorSpace = SRGBColorSpace;
    this.texture.anisotropy = 4;
    this.draw(0, true);
  }

  /** progress 0–1: yazılan karakter oranı; cursorOn imlecin yanıp sönmesi */
  draw(progress: number, cursorOn: boolean) {
    const chars = Math.floor(this.total * clamp01(progress));
    const key = chars * 2 + (cursorOn ? 1 : 0);
    if (key === this.shown) return;
    this.shown = key;

    const { ctx } = this;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, w, h);

    // Pencere çubuğu ve sekme
    ctx.fillStyle = COLORS.bar;
    ctx.fillRect(0, 0, w, 54);
    ['#ff5f57', '#febc2e', '#28c840'].forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(30 + i * 26, 27, 8, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(120, 10, 190, 44);
    ctx.fillStyle = COLORS.text;
    ctx.font = '500 20px "IBM Plex Mono", ui-monospace, monospace';
    ctx.textBaseline = 'middle';
    ctx.fillText('Program.cs', 140, 32);

    ctx.font = '22px "IBM Plex Mono", ui-monospace, monospace';
    const lineHeight = 38;
    let remaining = chars;
    let cursor: { x: number; y: number } | null = null;
    this.lines.forEach((tokens, row) => {
      const y = 92 + row * lineHeight;
      ctx.fillStyle = COLORS.gutter;
      ctx.textAlign = 'right';
      ctx.fillText(String(row + 1), 56, y);
      ctx.textAlign = 'left';
      let x = 84;
      for (const token of tokens) {
        if (remaining <= 0) break;
        const text = token.text.slice(0, remaining);
        remaining -= text.length;
        ctx.fillStyle = token.color;
        ctx.fillText(text, x, y);
        x += ctx.measureText(text).width;
      }
      if (remaining > 0) remaining -= 1; // satır sonu
      if (remaining <= 0 && !cursor) cursor = { x, y };
    });
    if (cursorOn) {
      const at = cursor ?? { x: 84, y: 92 + (this.lines.length - 1) * lineHeight };
      ctx.fillStyle = '#7c9bff';
      ctx.fillRect(at.x + 2, at.y - 14, 3, 28);
    }
    this.texture.needsUpdate = true;
  }
}

// ---- Yardımcı dokular ---------------------------------------------------------------------------

function iconTexture(icon: SceneIcon): CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = icon.hex;
  ctx.fillRect(0, 0, size, size);
  const scale = (size * 0.5) / 24;
  ctx.translate(size * 0.25, size * 0.25);
  ctx.scale(scale, scale);
  ctx.fillStyle = icon.glyph;
  ctx.fill(new Path2D(icon.path));
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function glowTexture(inner: string): CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

// ---- Sahne ---------------------------------------------------------------------------------------

export function createHeroScene({ canvas, container, data, reducedMotion, onAction }: Options): HeroScene | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  const world = new Group();
  scene.add(world);

  // Işıklar: soğuk mavi ve pembe kenar ışıkları, ekranın mavi parıltısı
  scene.add(new AmbientLight(0x8890b0, 0.5));
  scene.add(new HemisphereLight(0x9fb4ff, 0x1a1020, 0.8));
  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 6, 4);
  scene.add(key);
  const rimBlue = new PointLight(0x4f7bff, 40, 0, 2);
  rimBlue.position.set(-3.2, 2.4, 2);
  scene.add(rimBlue);
  const rimPink = new PointLight(0xff4f9a, 34, 0, 2);
  rimPink.position.set(3.4, 1.8, -1.6);
  scene.add(rimPink);
  const screenGlow = new PointLight(0x7aa2ff, 4, 4, 2);
  screenGlow.position.set(0, 0.9, 0.5);
  world.add(screenGlow);

  // Yüzen masa ve altındaki ışıma
  const desk = new Mesh(
    new RoundedBoxGeometry(6.6, 0.18, 3.4, 4, 0.08),
    new MeshStandardMaterial({ color: 0x141827, roughness: 0.55, metalness: 0.15 }),
  );
  desk.position.y = -0.09;
  world.add(desk);
  const glow = new Mesh(
    new PlaneGeometry(9, 6),
    new MeshBasicMaterial({ map: glowTexture('rgba(90,120,255,0.55)'), transparent: true, blending: AdditiveBlending, depthWrite: false }),
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -0.7;
  world.add(glow);

  // Dizüstü: gövde, klavye, dokunmatik yüzey ve menteşeden açılan kapak
  const laptop = new Group();
  laptop.position.set(0.15, 0, 0.2);
  world.add(laptop);
  const aluminium = new MeshStandardMaterial({ color: 0xc3c8d6, roughness: 0.32, metalness: 0.7 });
  const base = new Mesh(new RoundedBoxGeometry(2.4, 0.1, 1.6, 4, 0.04), aluminium);
  base.position.y = 0.05;
  laptop.add(base);
  const keyboard = new Mesh(new PlaneGeometry(2.08, 0.72), new MeshStandardMaterial({ color: 0x1e2130, roughness: 0.8 }));
  keyboard.rotation.x = -Math.PI / 2;
  keyboard.position.set(0, 0.101, -0.18);
  laptop.add(keyboard);
  const trackpad = new Mesh(new PlaneGeometry(0.78, 0.42), new MeshStandardMaterial({ color: 0xa9aec0, roughness: 0.4, metalness: 0.6 }));
  trackpad.rotation.x = -Math.PI / 2;
  trackpad.position.set(0, 0.101, 0.5);
  laptop.add(trackpad);

  const lid = new Group();
  lid.position.set(0, 0.1, -0.78);
  laptop.add(lid);
  const lidShell = new Mesh(new RoundedBoxGeometry(2.4, 1.55, 0.06, 4, 0.03), aluminium);
  lidShell.position.y = 0.775;
  lid.add(lidShell);
  const code = new CodeScreen(data);
  const screen = new Mesh(new PlaneGeometry(2.22, 1.39), new MeshBasicMaterial({ map: code.texture, toneMapped: false }));
  screen.position.set(0, 0.79, 0.032);
  lid.add(screen);
  const OPEN = -0.26;
  const CLOSED = Math.PI / 2 - 0.02;
  lid.rotation.x = reducedMotion ? OPEN : CLOSED;

  // Çerçeveli portre
  const frame = new Group();
  frame.position.set(-2.15, 0, -0.35);
  frame.rotation.set(-0.1, 0.5, 0);
  world.add(frame);
  const frameShell = new Mesh(
    new RoundedBoxGeometry(1.0, 1.24, 0.08, 4, 0.03),
    new MeshStandardMaterial({ color: 0x0c0d13, roughness: 0.4, metalness: 0.3 }),
  );
  frameShell.position.y = 0.62;
  frame.add(frameShell);
  const mat = new Mesh(new PlaneGeometry(0.88, 1.12), new MeshStandardMaterial({ color: 0xf1f1f4, roughness: 0.9 }));
  mat.position.set(0, 0.62, 0.041);
  frame.add(mat);
  const photoMaterial = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
  const photo = new Mesh(new PlaneGeometry(0.72, 0.9), photoMaterial);
  photo.position.set(0, 0.62, 0.042);
  frame.add(photo);
  new TextureLoader().load(data.portrait, (texture: Texture) => {
    texture.colorSpace = SRGBColorSpace;
    photoMaterial.map = texture;
    photoMaterial.needsUpdate = true;
    if (reducedMotion) render();
  });

  // Kupa
  const mug = new Group();
  mug.position.set(2.2, 0, 1.1);
  mug.rotation.y = -0.4;
  world.add(mug);
  const mugMaterial = new MeshStandardMaterial({ color: 0xff74aa, roughness: 0.35, metalness: 0.1 });
  const cup = new Mesh(new CylinderGeometry(0.22, 0.2, 0.46, 40), mugMaterial);
  cup.position.y = 0.23;
  mug.add(cup);
  const handle = new Mesh(new TorusGeometry(0.12, 0.035, 12, 32, Math.PI), mugMaterial);
  handle.position.set(0.22, 0.25, 0);
  handle.rotation.z = -Math.PI / 2;
  mug.add(handle);
  const coffee = new Mesh(new CircleGeometry(0.19, 32), new MeshStandardMaterial({ color: 0x2b1810, roughness: 0.3 }));
  coffee.rotation.x = -Math.PI / 2;
  coffee.position.y = 0.43;
  mug.add(coffee);

  // Kitap yığını (Deneyim'e götürür)
  const books = new Group();
  books.position.set(2.3, 0, -1.15);
  books.rotation.y = -0.35;
  world.add(books);
  const pages = new MeshStandardMaterial({ color: 0xece6d8, roughness: 0.9 });
  [
    { w: 1.0, h: 0.16, d: 0.7, color: 0x7c9bff, turn: 0 },
    { w: 0.92, h: 0.14, d: 0.66, color: 0xff74aa, turn: 0.12 },
    { w: 0.86, h: 0.18, d: 0.62, color: 0xa48fff, turn: -0.08 },
  ].reduce((y, book) => {
    const cover = new Mesh(new RoundedBoxGeometry(book.w, book.h, book.d, 3, 0.02), new MeshStandardMaterial({ color: book.color, roughness: 0.5 }));
    const block = new Mesh(new RoundedBoxGeometry(book.w * 0.94, book.h * 0.72, book.d * 0.96, 2, 0.01), pages);
    block.position.x = 0.03;
    const one = new Group();
    one.add(cover, block);
    one.position.y = y + book.h / 2;
    one.rotation.y = book.turn;
    books.add(one);
    return y + book.h;
  }, 0);

  // Etrafta dönen logo paraları
  const coins = data.icons.slice(0, 7).map((icon, i, all) => {
    const face = new MeshStandardMaterial({ map: iconTexture(icon), roughness: 0.35, metalness: 0.2 });
    const edge = new MeshStandardMaterial({ color: 0x2a2f45, roughness: 0.3, metalness: 0.8 });
    const coin = new Mesh(new CylinderGeometry(0.3, 0.3, 0.07, 48), [edge, face, face]);
    coin.rotation.x = Math.PI / 2;
    const holder = new Group();
    holder.add(coin);
    world.add(holder);
    return { holder, coin, phase: (i / all.length) * Math.PI * 2, speed: 0.18 + (i % 3) * 0.03, height: 1.35 + (i % 3) * 0.42 };
  });

  // ---- Tıklanabilir nesneler ---------------------------------------------------------------------
  const pickables: Object3D[] = [];
  const mark = (object: Object3D, action: SceneAction) => {
    object.traverse((child) => {
      child.userData.action = action;
    });
    pickables.push(object);
  };
  mark(frame, 'portrait');
  mark(laptop, 'projects');
  mark(books, 'experience');
  mark(mug, 'contact');
  coins.forEach(({ coin }) => mark(coin, 'skills'));

  const lift: Record<SceneAction, number> = { portrait: 0, projects: 0, skills: 0, experience: 0, contact: 0 };
  let hovered: SceneAction | null = null;
  let forced: SceneAction | null = null;
  let focusTarget = 0;
  let focus = 0;

  const tip = container.querySelector<HTMLElement>('[data-scene-tip]');
  const raycaster = new Raycaster();
  const ndc = new Vector2();
  const box = { width: 1, height: 1 };
  const basePos = new Vector3(0, 3.6, 10.2);
  const baseLook = new Vector3(0, 0.95, 0);

  // Portre: çerçevenin masadaki yeri ve kameraya uçarken kullandığı geçici vektörler
  const frameHome = frame.position.clone();
  const frameHomeQuat = frame.quaternion.clone();
  const frameFacing = frame.quaternion.clone();
  const forward = new Vector3();
  const flyTarget = new Vector3();

  // Nesnelerin üstündeki tıklanabilir noktalar (HTML düğmeleri): her karede 3D konumdan ekrana
  // izdüşürülür, böylece sahneyle birlikte hareket ederler
  const anchors: Record<SceneAction, { object: Object3D; offset: Vector3 }> = {
    portrait: { object: frame, offset: new Vector3(0, 1.48, 0.05) },
    projects: { object: lid, offset: new Vector3(0, 1.74, 0.05) },
    experience: { object: books, offset: new Vector3(0, 0.68, 0) },
    contact: { object: mug, offset: new Vector3(0, 0.26, 0.24) }, // kupanın üstünde, gövdesinde
    skills: { object: world, offset: new Vector3(1.15, 2.85, -0.7) },
  };
  const hotspots = [...container.querySelectorAll<HTMLElement>('[data-hotspot]')].map((el) => ({
    el,
    action: el.dataset.hotspot as SceneAction,
  }));
  const anchorPoint = new Vector3();

  function placeHotspots() {
    scene.updateMatrixWorld();
    for (const { el, action } of hotspots) {
      const anchor = anchors[action];
      if (!anchor) continue;
      anchorPoint.copy(anchor.offset);
      anchor.object.localToWorld(anchorPoint).project(camera);
      const x = ((anchorPoint.x + 1) / 2) * box.width;
      const y = ((1 - anchorPoint.y) / 2) * box.height;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    }
  }

  const pick = (event: MouseEvent): SceneAction | null => {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(pickables, true)[0];
    return (hit?.object.userData.action as SceneAction | undefined) ?? null;
  };

  const showTip = (action: SceneAction | null, event?: MouseEvent) => {
    if (!tip) return;
    if (!action || !event) {
      tip.classList.remove('is-visible');
      return;
    }
    const rect = container.getBoundingClientRect();
    tip.textContent = data.labels[action];
    tip.style.transform = `translate(${Math.round(event.clientX - rect.left + 16)}px, ${Math.round(event.clientY - rect.top + 16)}px)`;
    tip.classList.add('is-visible');
  };

  const requestRender = () => {
    if (!running) render();
  };

  canvas.addEventListener('pointermove', (event) => {
    const action = focusTarget ? null : pick(event);
    if (action !== hovered) {
      hovered = action;
      canvas.style.cursor = action ? 'pointer' : '';
      requestRender();
    }
    showTip(event.pointerType === 'touch' ? null : action, event);
  });
  canvas.addEventListener('pointerleave', () => {
    hovered = null;
    canvas.style.cursor = '';
    showTip(null);
    requestRender();
  });
  canvas.addEventListener('click', (event) => {
    if (focusTarget) return;
    const action = pick(event);
    if (!action) return;
    showTip(null);
    onAction(action);
  });

  // ---- Boyut, imleç ve kaydırma --------------------------------------------------------------
  const pointer = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0, scroll: 0 };
  let scroll = 0;

  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    box.width = width;
    box.height = height;
    const narrow = width < 640;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, narrow ? 1.5 : 1.75));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Dar/dikey kutularda sahne sığsın diye kamera geri çekilir
    const distance = camera.aspect < 0.95 ? 10.6 / Math.max(camera.aspect, 0.6) : 10.2;
    basePos.set(0, 3.6, distance);
    camera.updateProjectionMatrix();
    if (reducedMotion) render();
  };

  const onPointer = (event: PointerEvent) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  };
  const onScroll = () => {
    const rect = container.getBoundingClientRect();
    scroll = clamp01(-rect.top / Math.max(rect.height, 1));
  };

  // ---- Çizim döngüsü --------------------------------------------------------------------------
  let last = 0;
  let elapsed = 0;
  let frameId = 0;
  let running = false;

  function update(t: number) {
    const intro = reducedMotion ? 1 : easeOutExpo(clamp01(t / 1.6));
    world.scale.setScalar(MathUtils.lerp(0.82, 1, intro));
    world.position.y = MathUtils.lerp(-0.8, 0, intro);
    lid.rotation.x = reducedMotion ? OPEN : MathUtils.lerp(CLOSED, OPEN, easeInOutCubic(clamp01((t - 0.5) / 1.3)));
    code.draw(reducedMotion ? 1 : clamp01((t - 1.7) / 6), reducedMotion || Math.floor(t * 2) % 2 === 0);

    // Portre odağı: bu sırada imleç ve kaydırma sahneyi döndürmez
    focus = reducedMotion ? focusTarget : focus + (focusTarget - focus) * 0.08;
    const f = easeInOutCubic(clamp01(focus));

    smooth.x += (pointer.x - smooth.x) * 0.05;
    smooth.y += (pointer.y - smooth.y) * 0.05;
    smooth.scroll += (scroll - smooth.scroll) * 0.08;
    const sway = reducedMotion ? 0 : Math.sin(t * 0.35) * 0.08;
    world.rotation.y = -0.32 + (smooth.x * 0.28 + sway + smooth.scroll * 0.7) * (1 - f);
    world.rotation.x = (smooth.y * 0.06 + smooth.scroll * 0.18) * (1 - f);
    camera.position.copy(basePos);
    camera.lookAt(baseLook);

    // Üzerine gelinen nesne hafifçe kalkar
    for (const action of ACTIONS) {
      const target = !focusTarget && (hovered === action || forced === action) ? 1 : 0;
      lift[action] = reducedMotion ? target : lift[action] + (target - lift[action]) * 0.15;
    }
    laptop.position.y = lift.projects * 0.1;
    mug.position.y = lift.contact * 0.14;
    books.position.y = lift.experience * 0.14;

    // Çerçeve masadan kalkar, dönerek kameranın tam önüne uçar (fotoğrafın ortası görüş merkezine)
    frame.position.copy(frameHome);
    frame.position.y += lift.portrait * 0.14;
    frame.quaternion.copy(frameHomeQuat);
    if (f > 0.001) {
      camera.getWorldDirection(forward);
      flyTarget.copy(camera.position).addScaledVector(forward, 3.3);
      world.updateMatrixWorld();
      world.worldToLocal(flyTarget);
      flyTarget.y -= 0.62;
      frame.lookAt(camera.position);
      frameFacing.copy(frame.quaternion);
      frame.position.lerpVectors(frameHome, flyTarget, f);
      frame.position.y += Math.sin(f * Math.PI) * 0.6; // yay çizerek
      frame.quaternion.slerpQuaternions(frameHomeQuat, frameFacing, f);
    }

    coins.forEach(({ holder, coin, phase, speed, height }) => {
      const angle = phase + (reducedMotion ? 0 : t * speed);
      holder.position.set(Math.cos(angle) * 3.1, height + Math.sin(t * 0.9 + phase) * (reducedMotion ? 0 : 0.12), Math.sin(angle) * 1.7 - 0.3);
      coin.rotation.z = reducedMotion ? 0 : Math.sin(t * 0.8 + phase) * 0.6;
      coin.scale.setScalar(1 + lift.skills * 0.3);
      holder.lookAt(camera.position.x, holder.position.y, camera.position.z);
    });
    glow.material.opacity = 0.75 + Math.sin(t * 1.3) * (reducedMotion ? 0 : 0.15);
  }

  function render() {
    update(reducedMotion ? 10 : elapsed);
    placeHotspots();
    renderer.render(scene, camera);
  }

  function loop(now: number) {
    // Sekme arka plandan dönünce sahne zıplamasın: adım en fazla 50 ms
    elapsed += Math.min((now - last) / 1000, 0.05);
    last = now;
    render();
    frameId = requestAnimationFrame(loop);
  }

  function start() {
    if (running || reducedMotion) return;
    running = true;
    last = performance.now();
    frameId = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frameId);
  }

  // Ekranda değilken ya da sekme gizliyken çizim durur
  let visible = true;
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !document.hidden) start();
    else stop();
  });
  observer.observe(container);
  const onVisibility = () => (document.hidden || !visible ? stop() : start());
  document.addEventListener('visibilitychange', onVisibility);

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  resize();
  onScroll();
  render();
  start();

  return {
    focusPortrait(on) {
      focusTarget = on ? 1 : 0;
      hovered = null;
      canvas.style.cursor = '';
      showTip(null);
      requestRender();
    },
    highlight(action) {
      forced = action;
      requestRender();
    },
    dispose() {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onScroll);
      renderer.dispose();
    },
  };
}
