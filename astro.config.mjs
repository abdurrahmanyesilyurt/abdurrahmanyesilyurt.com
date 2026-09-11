// @ts-check
import { defineConfig } from 'astro/config';

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

  // Sıkı CSP (vercel.json) satır içi <style> kabul etmez; tüm CSS harici dosya olarak kalsın.
  build: {
    inlineStylesheets: 'never',
  },

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
