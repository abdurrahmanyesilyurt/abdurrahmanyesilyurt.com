import * as simpleIcons from 'simple-icons';

export interface BrandIcon {
  title: string;
  hex: string;
  path: string;
  /** Marka rengi zemin üstünde okunur simge rengi */
  glyph: string;
}

const bySlug = new Map<string, { title: string; hex: string; path: string }>();
for (const icon of Object.values(simpleIcons)) {
  if (icon && typeof icon === 'object' && 'slug' in icon) bySlug.set(icon.slug, icon);
}

/** sRGB bağıl parlaklık (WCAG) */
function luminance(hex: string): number {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const DARK_GLYPH = '#161613';

/** simple-icons kısa adından logo; bulunamazsa undefined (o yetenek logosuz gösterilir) */
export function brandIcon(slug: string | undefined): BrandIcon | undefined {
  const icon = slug ? bySlug.get(slug) : undefined;
  if (!icon) return undefined;
  // Beyaz simge 3:1 kontrastı sağlıyorsa beyaz (marka rozetlerindeki gibi), sağlamıyorsa koyu
  const whiteContrast = 1.05 / (luminance(icon.hex) + 0.05);
  return { title: icon.title, hex: `#${icon.hex}`, path: icon.path, glyph: whiteContrast >= 3 ? '#ffffff' : DARK_GLYPH };
}
