// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Vercel'de ana domain www; kök domain buraya 308 ile yönlenir
  site: 'https://www.abdurrahmanyesilyurt.com',

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

  // Shiki her token için style="" basar (CSP'ye takılır); Prism sadece sınıf adı basar
  markdown: {
    syntaxHighlight: 'prism',
  },

  vite: {
    plugins: [tailwindcss()],
    // Astro küçük <script>'leri HTML'e gömer; CSP (script-src 'self') için hepsi ayrı dosya olsun.
    // 3D sahne (three.js) ve fizik motoru zaten tembel yüklenen ayrı parçalar; uyarı sınırı ona göre.
    build: {
      assetsInlineLimit: 0,
      chunkSizeWarningLimit: 700,
    },
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
