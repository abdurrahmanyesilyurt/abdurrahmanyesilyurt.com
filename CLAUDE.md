## Project

Personal CV site for abdurrahmanyesilyurt.com — static Astro + Tailwind v4, deployed on Vercel.

- All CV content lives in `src/data/cv.ts` (fields are either plain strings or `{ tr, en }`); UI strings in `src/i18n/ui.ts`.
- `/` is Turkish (default locale), `/en/` is English. Both render `src/components/CVPage.astro`.
- Colors are CSS tokens using `light-dark()` in `src/styles/global.css`. The site is dark-first: `:root` is `color-scheme: dark` and the theme toggle sets `data-theme="light"`; print is always light. `--hue-1…6` is the shared palette; `src/lib/tints.ts` hands out the `[--tile:var(--hue-N)]` classes used by `.tile-tint` cards and project monograms.
- The hero is a small name + tagline next to a three.js scene (`src/scripts/hero-scene.ts`: a laptop typing code, the framed portrait, mug, orbiting skill-logo coins). It is dynamically imported on idle, pauses off-screen, renders one static frame under `prefers-reduced-motion`, and is skipped with Save-Data; the `<Picture>` portrait is the fallback until the stage gets `is-ready`. Scene data travels in `data-scene` (JSON). The long `summary` sits below the hero; `tagline` is screen-only. Scene objects are clickable (raycast, `SceneAction`), and each has a pulsing hotspot (`[data-hotspot]` button/link) that the scene re-projects onto it every frame — the keyboard path, with its label on hover/focus (always shown on touch). The frame opens portrait mode: it flies off the desk to the camera, then `is-portrait` on `[data-hero-stage]` fades in the crisp `.hero-portrait` (start size `--fds`); "Back to the desk", Esc or a click on the portrait return. The laptop, the coins' hotspot, the books and the mug link to Projects, Skills, Experience and Contact.
- Interactive extras: `.glow-card` (`src/scripts/glow-cards.ts`) writes `--mx/--my/--rx/--ry` via CSSOM for the cursor-following border light and tilt on project and skill cards; `TechPool.astro` + `src/scripts/tech-pool.ts` (matter-js, loaded when the pool scrolls into view) is the draggable physics logo pit, which stays a static pile without JS or with reduced motion. Setting styles through CSSOM (`el.style.setProperty`, `style.transform`) is CSP-safe; `setAttribute('style', …)` is not.
- `astro.config.mjs` sets `vite.build.assetsInlineLimit: 0` because Astro otherwise inlines small `<script>`s, which the CSP blocks. Component `<script>`s are fine — they ship as `/_astro/*.js`.
- The print stylesheet (`print:` variants + `@media print`) turns the page into a downloadable CV. Keep page breaks clean: short experience entries and short sections (`<Section keepTogether>`) use `print-break-avoid`; only long entries may split between bullets. In print, contact details sit under the name (Hero) and the Contact section is hidden.
- Experience entries, project cards and skill groups are native `<details data-expandable>` accordions (closed by default) so the page stays short. `ExpandAll.astro` is the per-section "Expand all" button and `ToggleIcon.astro` the "+" marker; `public/site.js` drives the button and opens every entry on `beforeprint` (restored on `afterprint`); a `::details-content` print rule is the fallback. Inside `<summary>` keep headings as direct children (no `div`/`p`). Closed project cards show the icon (or a monogram when there is none); closed skill groups preview up to six brand icons, core ones first.
- Blog posts live in `src/content/posts/{tr,en}/*.md` (schema in `src/content.config.ts`); the folder sets the language, the file name the slug, and a shared `translationKey` links translations. Routes: `/yazilar/<slug>/`, `/en/writing/<slug>/`, feeds `/rss.xml` and `/en/rss.xml`. Code highlighting must stay on Prism — Shiki emits inline `style` attributes that the CSP blocks.
- Share images are generated at build time by `src/lib/og.ts` (satori → SVG, sharp → PNG): `/og/{tr,en}.png` for the home/blog pages and `/og/<lang>/<slug>.png` per post. satori can't read WOFF2, and it only falls back to the Latin-Ext files (ş, ğ, İ) when they're loaded under a different name in a family stack (`Serif, SerifExt`). `package.json` overrides `fflate` to 0.7.5 because satori pins a vulnerable 0.7.3 — drop the override once satori updates.
- Vercel Web Analytics loads from `/_vercel/insights/script.js` in production builds only; a 404 for it on a local server is expected.
- Skills items are plain strings or `{ label, icon, core }`. `icon` is a simple-icons slug rendered at build time by `TechIcon.astro` (brand-coloured circle; `src/lib/icons.ts` picks a readable glyph colour); unknown slugs fall back to a plain chip. `core: true` marks the accent-ringed "core focus" chips. The first skill group is the wide card. Projects with `featured: true` get an accent card border.
- Projects (`cv.projects`) only link public pages and store listings — never API, admin, staging or private repo URLs. QR codes are rendered at build time by `src/components/QrCode.astro` (uqr → one SVG path, no inline styles).
- `vercel.json` sends a strict CSP (`default-src 'none'`, no `'unsafe-inline'`). Never add inline `<script>`, `<style>`, `style=""` attributes or `on*=` handlers — use Tailwind classes (e.g. `[--i:3]` for custom properties) and put client JS in `public/site.js` or a component `<script>`. `npm run check:csp` enforces this on the build output and runs in CI.

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
