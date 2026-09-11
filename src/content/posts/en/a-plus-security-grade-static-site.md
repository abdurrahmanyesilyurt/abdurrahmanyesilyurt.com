---
title: An A+ security grade for a static site
description: "The settings that give this site an A+ with 140 points on Mozilla Observatory: a CSP without 'unsafe-inline', security headers on Vercel, and a CI check that keeps them intact."
date: 2026-09-11
tags: [security, astro, vercel]
translationKey: a-plus-security
---

When you build a static site, it's easy to ask why you'd bother with security headers: there's no database, no forms and no login. But headers that tell the browser what it may and may not load limit the damage of a mistake you might make later. And for a backend developer, their own website is the first place to show how they approach this kind of work.

In this post I walk through the settings that give my site an **A+ (140/100)** on [Mozilla Observatory](https://developer.mozilla.org/en-US/observatory/analyze?host=www.abdurrahmanyesilyurt.com) and an **A+** on securityheaders.com. The site is built with Astro, hosted on Vercel, and its source code is [public on GitHub](https://github.com/abdurrahmanyesilyurt/abdurrahmanyesilyurt.com).

## The goal: a CSP without `'unsafe-inline'`

A Content Security Policy (CSP) tells the browser where scripts, styles, fonts and images may be loaded from. This is the site's policy:

```text
default-src 'none'; script-src 'self'; style-src 'self';
img-src 'self' data:; font-src 'self'; connect-src 'self';
base-uri 'none'; form-action 'none'; frame-ancestors 'none';
upgrade-insecure-requests
```

`default-src 'none'` blocks everything by default, and then I allow only the types the site actually uses, from my own domain. What matters most is the absence of `'unsafe-inline'`: even if a `<script>` were somehow injected into the page, the browser wouldn't run it.

The price is that **no inline code can remain on the page**. On this site it came from four places:

1. **The theme script.** To apply the light/dark preference before the first paint, a small inline script usually goes into `<head>`. I moved it to `public/site.js` and load it with `<script src="/site.js">`. The same file handles clicks on the theme and PDF buttons through event delegation.
2. **Font declarations.** Astro's font component printed the `@font-face` rules as an inline `<style>`. I import the fonts from Fontsource packages instead, so the rules now live in the bundled CSS file.
3. **`style=""` attributes.** I replaced attributes such as `style="--i: 3"` (used for animation delays) with Tailwind arbitrary property classes (`[--i:3]`), so the value is written to the stylesheet.
4. **Tools that emit styles.** Shiki adds an inline style to every token when highlighting code, so this blog uses Prism, which only adds class names. The QR codes on the project cards are rendered at build time as a single SVG `path`.

Structured data added with `<script type="application/ld+json">` is the one exception: it's a data block that never runs, so CSP doesn't block it.

## The other headers

All headers are defined in `vercel.json`:

```json
{ "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains" },
{ "key": "X-Content-Type-Options", "value": "nosniff" },
{ "key": "X-Frame-Options", "value": "DENY" },
{ "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
{ "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
{ "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
{ "key": "Cross-Origin-Resource-Policy", "value": "same-origin" }
```

- **HSTS** tells the browser to use HTTPS only for this site for two years.
- **`X-Frame-Options: DENY`** together with `frame-ancestors 'none'` in the CSP stops the site from being framed by another page (clickjacking).
- **`nosniff`** stops the browser from guessing file types.
- **Referrer-Policy** shares only the domain, not the full address, on links to other sites.
- **Permissions-Policy** turns off features such as the camera, microphone and location for the page entirely.

## Guarding against regressions: a CSP check in CI

The biggest risk with a strict CSP is adding an inline `style=""` one day without noticing and having something quietly break in production. To prevent that, I wrote a small script that scans the build output (`scripts/check-csp.mjs`). It looks for inline `<script>` and `<style>` elements, `style` attributes, `on*=` event handlers and `javascript:` links in every HTML file, and fails the build if it finds any:

```js
const rules = [
  { name: 'inline <script>', pattern: /<script\b(?![^>]*\bsrc=)(?![^>]*\btype=["']?application\/(?:ld\+)?json)[^>]*>/gi },
  { name: 'inline <style>', pattern: /<style\b[^>]*>/gi },
  { name: 'style attribute', pattern: /<[^>]+\sstyle=["'][^>]*>/gi },
  { name: 'inline event handler', pattern: /<[^>]+\son[a-z]+=["'][^>]*>/gi },
];
```

GitHub Actions runs the type check, the build and this check on every push, so inline code added by mistake is caught before it reaches production.

## The repository itself

Security isn't only about HTTP headers. The repository also has:

- Dependabot version and security updates,
- CodeQL code scanning, secret scanning and push protection,
- GitHub Actions pinned to commit SHAs and a read-only workflow token,
- private vulnerability reporting through `SECURITY.md` and `/.well-known/security.txt`.

## Wrapping up

Getting an A+ on a static site isn't hard. The real work is removing inline code from the page systematically and making that stick with a check. You can scan your own site with [Mozilla Observatory](https://developer.mozilla.org/en-US/observatory/) to see where to start.
