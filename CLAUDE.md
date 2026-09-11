## Project

Personal CV site for abdurrahmanyesilyurt.com — static Astro + Tailwind v4, deployed on Vercel.

- All CV content lives in `src/data/cv.ts` (fields are either plain strings or `{ tr, en }`); UI strings in `src/i18n/ui.ts`.
- `/` is Turkish (default locale), `/en/` is English. Both render `src/components/CVPage.astro`.
- Colors are CSS tokens using `light-dark()` in `src/styles/global.css`; `data-theme` on `<html>` overrides the system theme.
- The print stylesheet (`print:` variants + `@media print`) turns the page into a downloadable CV. Keep page breaks clean: short experience entries and short sections (`<Section keepTogether>`) use `print-break-avoid`; only long entries may split between bullets. In print, contact details sit under the name (Hero) and the Contact section is hidden.
- Experience entries are native `<details data-expandable>` accordions (closed by default). `public/site.js` drives the "Expand all" button and opens every entry on `beforeprint` (restored on `afterprint`); a `::details-content` print rule is the fallback. Inside `<summary>` keep headings as direct children (no `div`/`p`).
- Blog posts live in `src/content/posts/{tr,en}/*.md` (schema in `src/content.config.ts`); the folder sets the language, the file name the slug, and a shared `translationKey` links translations. Routes: `/yazilar/<slug>/`, `/en/writing/<slug>/`, feeds `/rss.xml` and `/en/rss.xml`. Code highlighting must stay on Prism — Shiki emits inline `style` attributes that the CSP blocks.
- Vercel Web Analytics loads from `/_vercel/insights/script.js` in production builds only; a 404 for it on a local server is expected.
- Projects (`cv.projects`) only link public pages and store listings — never API, admin, staging or private repo URLs. QR codes are rendered at build time by `src/components/QrCode.astro` (uqr → one SVG path, no inline styles).
- `vercel.json` sends a strict CSP (`default-src 'none'`, no `'unsafe-inline'`). Never add inline `<script>`, `<style>`, `style=""` attributes or `on*=` handlers — use Tailwind classes (e.g. `[--i:3]` for custom properties) and put client JS in `public/site.js`. `npm run check:csp` enforces this on the build output and runs in CI.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
