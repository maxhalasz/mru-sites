// Fails if a built page links to an internal file that does not exist.
// Usage: node scripts/link-check.mjs apps/neurostat/dist [more folders]
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const dirs = process.argv.slice(2);
if (!dirs.length) { console.error('link-check: no folders given'); process.exit(2); }

const bad = [];
let pages = 0;
let links = 0;

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}

function exists(root, urlPath) {
  const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  const base = join(root, clean);
  if (existsSync(base) && statSync(base).isFile()) return true;
  if (existsSync(join(base, 'index.html'))) return true;
  return false;
}

for (const root of dirs) {
  for (const file of walk(root).filter((f) => f.endsWith('.html'))) {
    pages++;
    const html = readFileSync(file, 'utf8');
    const pageUrl = '/' + file.slice(root.length + 1).replace(/\\/g, '/').replace(/index\.html$/, '');
    for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const u = m[1];
      if (/^(https?:|mailto:|tel:|data:|javascript:|#)/.test(u)) continue;
      links++;
      const target = u.startsWith('/') ? u : resolve('/', dirname(pageUrl + 'x'), u).replace(/^[A-Za-z]:/, '').replace(/\\/g, '/');
      if (!exists(root, target)) bad.push(`${pageUrl} -> ${u}`);
    }
  }
}

if (bad.length) { console.error('BROKEN LINKS\n' + [...new Set(bad)].join('\n')); process.exit(1); }
console.log(`link-check OK (${pages} pages, ${links} internal links)`);
