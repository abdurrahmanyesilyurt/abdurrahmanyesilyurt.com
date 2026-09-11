// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://abdurrahmanyesilyurt.com',

  // Türkçe varsayılan dil: / → Türkçe, /en/ → İngilizce
  i18n: {
    locales: ['tr', 'en'],
    defaultLocale: 'tr',
    routing: { prefixDefaultLocale: false },
  },

  // Fontlar build sırasında indirilip siteyle birlikte sunulur (Google'a istek gitmez)
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Instrument Serif',
      cssVariable: '--font-instrument-serif',
      weights: [400],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Instrument Sans',
      cssVariable: '--font-instrument-sans',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-plex-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['monospace'],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'tr',
        locales: { tr: 'tr-TR', en: 'en-US' },
      },
    }),
  ],
});
