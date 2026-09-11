// Paylaşım (Open Graph) görselleri: build sırasında satori ile SVG'ye, sharp ile PNG'ye çevrilir.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { cv, t } from '../data/cv';
import { ui, type Lang } from '../i18n/ui';
import { formatPostDate, postMeta, type Post } from './posts';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// Sitenin koyu tema renkleri
const color = { paper: '#0f100e', ink: '#ece8df', ink2: '#a9a59b', ink3: '#6f6c64', rule: '#2a2b27', accent: '#5bd69a' };

// satori WOFF2 okuyamadığı için Fontsource paketlerindeki WOFF dosyaları kullanılır.
// Latin ve Latin-Ext (ş, ğ, İ...) ayrı dosyalar; farklı adlarla yüklenip fontFamily'de
// "Serif, SerifExt" diye sıralanınca satori eksik harfi ikinci dosyadan alıyor.
const fontDir = (pkg: string) => join(process.cwd(), 'node_modules', pkg, 'files');
const serifPkg = '@fontsource/instrument-serif';
const monoPkg = '@fontsource/ibm-plex-mono';
const fontFiles = [
  { name: 'Serif', file: 'instrument-serif-latin-400-normal.woff', pkg: serifPkg, weight: 400, style: 'normal' },
  { name: 'SerifExt', file: 'instrument-serif-latin-ext-400-normal.woff', pkg: serifPkg, weight: 400, style: 'normal' },
  { name: 'Serif', file: 'instrument-serif-latin-400-italic.woff', pkg: serifPkg, weight: 400, style: 'italic' },
  { name: 'SerifExt', file: 'instrument-serif-latin-ext-400-italic.woff', pkg: serifPkg, weight: 400, style: 'italic' },
  { name: 'Mono', file: 'ibm-plex-mono-latin-400-normal.woff', pkg: monoPkg, weight: 400, style: 'normal' },
  { name: 'MonoExt', file: 'ibm-plex-mono-latin-ext-400-normal.woff', pkg: monoPkg, weight: 400, style: 'normal' },
] as const;
const SERIF = 'Serif, SerifExt';
const MONO = 'Mono, MonoExt';

let fontsPromise: ReturnType<typeof loadFonts> | undefined;
async function loadFonts() {
  return Promise.all(
    fontFiles.map(async ({ name, file, pkg, weight, style }) => ({
      name,
      data: await readFile(join(fontDir(pkg), file)),
      weight,
      style,
    })),
  );
}

// satori React öğesi bekler; React olmadan aynı biçimdeki düz nesnelerle çalışır
type Node = { type: string; props: { style?: Record<string, unknown>; children?: Node | string | (Node | string)[] } };
const el = (style: Record<string, unknown>, children?: Node['props']['children']): Node => ({
  type: 'div',
  props: { style: { display: 'flex', ...style }, children },
});

const upper = (text: string, lang: Lang) => text.toLocaleUpperCase(lang === 'tr' ? 'tr-TR' : 'en-US');
const domain = 'ABDURRAHMANYESILYURT.COM';

function frame(top: Node[], middle: Node, bottom: Node): Node {
  return el(
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '60px 72px',
      backgroundColor: color.paper,
      color: color.ink,
      fontFamily: MONO,
    },
    [
      el({ justifyContent: 'space-between', alignItems: 'center', fontSize: 21, letterSpacing: 2, color: color.ink2 }, top),
      middle,
      el({ flexDirection: 'column', borderTop: `1px solid ${color.rule}`, paddingTop: 26 }, bottom),
    ],
  );
}

export function homeCard(lang: Lang): Node {
  const s = ui[lang];
  const split = cv.name.lastIndexOf(' ');
  const badge = el(
    { alignItems: 'center', border: `1px solid ${color.rule}`, borderRadius: 999, padding: '9px 20px' },
    [el({ width: 12, height: 12, borderRadius: 6, backgroundColor: color.accent, marginRight: 12 }), upper(s.openToWork, lang)],
  );

  return frame(
    [el({}, domain), cv.openToWork ? badge : el({})],
    el({ flexDirection: 'column', fontFamily: SERIF, fontSize: 158, lineHeight: 0.92, letterSpacing: -4 }, [
      el({}, cv.name.slice(0, split)),
      el({ fontStyle: 'italic', color: color.accent }, cv.name.slice(split + 1)),
    ]),
    el({ flexDirection: 'column' }, [
      el({ fontFamily: SERIF, fontSize: 46, lineHeight: 1.1 }, t(cv.title, lang)),
      // Teknoloji adları İngilizce: Türkçe büyük harf kuralı "NATIVE"i "NATİVE" yapmasın
      el({ marginTop: 14, fontSize: 21, letterSpacing: 2, color: color.ink2 }, upper(cv.focus.join(' · '), 'en')),
    ]),
  );
}

export function postCard(post: Post): Node {
  const { lang } = postMeta(post);
  const s = ui[lang];
  const { title, date, tags } = post.data;
  const fontSize = title.length <= 36 ? 92 : title.length <= 64 ? 76 : 62;

  return frame(
    [el({}, `${upper(s.sections.writing.label, lang)} · ${domain}`), el({}, upper(formatPostDate(date, lang), lang))],
    el({ fontFamily: SERIF, fontSize, lineHeight: 1.02, letterSpacing: -1.5, maxWidth: 1000 }, title),
    el({ justifyContent: 'space-between', alignItems: 'flex-end' }, [
      el({ fontFamily: SERIF, fontSize: 38 }, [
        el({}, cv.name.slice(0, cv.name.lastIndexOf(' '))),
        el({ fontStyle: 'italic', color: color.accent, marginLeft: 11 }, cv.name.slice(cv.name.lastIndexOf(' ') + 1)),
      ]),
      // Etiketler yazıldığı gibi: Türkçe yazıda "api" gibi İngilizce etiketler "APİ" olmasın
      el({ fontSize: 21, letterSpacing: 1, color: color.ink2 }, tags.map((tag) => `#${tag}`).join('  ')),
    ]),
  );
}

export async function renderPng(card: Node): Promise<ArrayBuffer> {
  fontsPromise ??= loadFonts();
  // satori'nin tipi React öğesi ister; aynı biçimdeki düz nesne verildiği için tip dönüştürülüyor
  const svg = await satori(card as unknown as Parameters<typeof satori>[0], {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: await fontsPromise,
  });
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  return Uint8Array.from(png).buffer;
}
