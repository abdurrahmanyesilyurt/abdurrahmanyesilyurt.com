// Renkli kartlar için sırayla dönen tonlar (global.css'teki --hue-1…6). Sınıf adları burada açıkça
// yazılı olmalı: Tailwind yalnızca kaynakta gördüğü sınıfları üretir. Kartta "tile-tint" ile kullanılır.
const TINTS = [
  '[--tile:var(--hue-1)]',
  '[--tile:var(--hue-2)]',
  '[--tile:var(--hue-3)]',
  '[--tile:var(--hue-4)]',
  '[--tile:var(--hue-5)]',
  '[--tile:var(--hue-6)]',
] as const;

export const tint = (index: number) => TINTS[index % TINTS.length];

// Dolu renk bloğu + zemin rengi yazı için yalnızca beyaz yazıyı taşıyabilen tonlar (sarı ve nane hariç)
const SOLID_TINTS = [TINTS[0], TINTS[1], TINTS[3], TINTS[5]] as const;

export const solidTint = (index: number) => SOLID_TINTS[index % SOLID_TINTS.length];
