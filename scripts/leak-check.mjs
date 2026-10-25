// Fails the build if a published folder contains private material.
// Usage: node scripts/leak-check.mjs apps/neurostat/dist apps/kelvara/dist
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const dirs = process.argv.slice(2);
if (!dirs.length) { console.error('leak-check: no folders given'); process.exit(2); }

// Marker phrases come from private/markers.txt (one per line). Empty lines and # comments are ignored.
const markersFile = 'private/markers.txt';
const markers = existsSync(markersFile)
  ? readFileSync(markersFile, 'utf8').split('\n').map((s) => s.trim()).filter((s) => s && !s.startsWith('#'))
  : [];

// Every private portal document adds its number and title as markers.
function portalMarkers(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const acct of readdirSync(dir)) {
    const d = join(dir, acct);
    if (!statSync(d).isDirectory()) continue;
    for (const f of readdirSync(d).filter((n) => n.endsWith('.md'))) {
      const text = readFileSync(join(d, f), 'utf8');
      for (const key of ['number', 'title']) {
        const m = text.match(new RegExp('^' + key + ':\\s*"?(.+?)"?\\s*$', 'm'));
        if (m && m[1].length >= 8) out.push(m[1]);
      }
    }
  }
  return out;
}
markers.push(...portalMarkers('private/portal'));
if (existsSync('private/log-keys.json')) {
  const k = JSON.parse(readFileSync('private/log-keys.json', 'utf8')).privateJwk || {};
  for (const part of ['d', 'p', 'q', 'dp', 'dq', 'qi']) if (k[part]) markers.push(String(k[part]).slice(0, 40));
}

const forbiddenNames = [/\.map$/i, /^credentials$/i, /PITCH\.md$/i, /NOTAS-DO-MESTRE/i, /IMAGENS\.md$/i];
const forbiddenText = [/game ?master/i, /google sheet|apps script/i, /firebase/i, /C:\\Users\\/i, /\/Users\/max\b/i, /\bprivate\/portal\b/i, /\bmru-sites\b/i, /\bmaxhalasz\b/i];
const textExt = new Set(['.html', '.js', '.mjs', '.css', '.json', '.txt', '.xml', '.svg', '.md', '.webmanifest']);

const problems = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (forbiddenNames.some((r) => r.test(name))) problems.push(`${p}: forbidden file`);
    if (!textExt.has(extname(name).toLowerCase())) continue;
    const body = readFileSync(p, 'utf8');
    for (const m of markers) if (body.includes(m)) problems.push(`${p}: contains private marker "${m}"`);
    for (const r of forbiddenText) if (r.test(body)) problems.push(`${p}: matches ${r}`);
  }
}
for (const d of dirs) walk(d);

if (problems.length) { console.error('LEAK CHECK FAILED\n' + problems.join('\n')); process.exit(1); }
console.log(`leak-check OK (${dirs.length} folders, ${markers.length} markers)`);
