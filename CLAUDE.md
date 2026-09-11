## Project

Personal CV site for abdurrahmanyesilyurt.com — static Astro + Tailwind v4, deployed on Vercel.

- All CV content lives in `src/data/cv.ts` (fields are either plain strings or `{ tr, en }`); UI strings in `src/i18n/ui.ts`.
- `/` is Turkish (default locale), `/en/` is English. Both render `src/components/CVPage.astro`.
- Colors are CSS tokens using `light-dark()` in `src/styles/global.css`; `data-theme` on `<html>` overrides the system theme.
- Keep the print stylesheet (`print:` variants + `@media print`) fitting on one A4 page.

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
