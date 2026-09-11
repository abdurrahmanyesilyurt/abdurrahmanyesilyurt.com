// Fails the build if the generated HTML contains anything the strict
// Content-Security-Policy in vercel.json would block (no 'unsafe-inline').
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));

const rules = [
  // JSON-LD and other data blocks are never executed, so CSP ignores them
  { name: 'inline <script>', pattern: /<script\b(?![^>]*\bsrc=)(?![^>]*\btype=["']?application\/(?:ld\+)?json)[^>]*>/gi },
  { name: 'inline <style>', pattern: /<style\b[^>]*>/gi },
  { name: 'style attribute', pattern: /<[^>]+\sstyle=["'][^>]*>/gi },
  { name: 'inline event handler', pattern: /<[^>]+\son[a-z]+=["'][^>]*>/gi },
  { name: 'javascript: URL', pattern: /\s(?:href|src|action)=["']\s*javascript:/gi },
];

const files = (await readdir(dist, { recursive: true })).filter((file) => file.endsWith('.html'));
if (files.length === 0) {
  console.error('No HTML files found in dist/. Run `npm run build` first.');
  process.exit(1);
}

const problems = [];
for (const file of files) {
  const html = await readFile(join(dist, file), 'utf8');
  for (const { name, pattern } of rules) {
    for (const match of html.matchAll(pattern)) {
      problems.push(`${file}: ${name} → ${match[0].slice(0, 100)}`);
    }
  }
}

if (problems.length > 0) {
  console.error(`CSP check failed with ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error('\nThe CSP in vercel.json only allows same-origin files. Move inline code into a file in src/ or public/.');
  process.exit(1);
}

console.log(`CSP check passed: ${files.length} HTML files, no inline scripts, styles or event handlers.`);
