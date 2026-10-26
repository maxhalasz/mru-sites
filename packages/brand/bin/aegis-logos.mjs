#!/usr/bin/env node
// Draws the Aegis Corporation logos into packages/brand/logos (text is outlined, no font needed to view them).
//   node packages/brand/bin/aegis-logos.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import opentype from 'opentype.js';
import { Resvg } from '@resvg/resvg-js';

const require = createRequire(import.meta.url);
const buf = readFileSync(require.resolve('@fontsource/oswald/files/oswald-latin-500-normal.woff'));
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const CAP = font.tables.os2.sCapHeight / font.unitsPerEm;
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'logos');

// Palette: a light, open blue, far from NeuroStat's navy (#14243a).
const C = { sky: '#4da3e0', deep: '#2b78b8', pale: '#e6f3fc', slate: '#6b7f92' };

// Text as outlines. Returns the path and the ink width.
function word(text, cap, track, x, baseline) {
  const size = cap / CAP, scale = size / font.unitsPerEm;
  let cx = 0, left = null, right = 0;
  const parts = [];
  for (const ch of text) {
    const g = font.charToGlyph(ch);
    parts.push({ g, cx });
    const b = g.getBoundingBox();
    if (b.x2 > b.x1) { if (left === null) left = cx + b.x1 * scale; right = cx + b.x2 * scale; }
    cx += g.advanceWidth * scale + track * size;
  }
  const d = parts.map(({ g, cx: gx }) => g.getPath(x - left + gx, baseline, size).toPathData(2)).join('');
  return { d, width: right - left };
}

// Shield with an open "A" cut out of it. 100 x 120 box.
const SHIELD = 'M50 3 L93 17 V57 C93 86 73 106 50 117 C27 106 7 86 7 57 V17 Z';
const A = 'M50 27 L77 91 H65 L59.5 77 H40.5 L35 91 H23 Z M44.5 66.5 H55.5 L50 52.5 Z';

function mark({ shield, letter }) {
  return `<path d="${SHIELD}" fill="${shield}"/><path d="${A}" fill="${letter}" fill-rule="evenodd"/>`;
}

function markSvg(v) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" role="img"><title>Aegis Corporation</title>${mark(v)}</svg>\n`;
}

function logoSvg(v) {
  const x = 128; // text starts here, to the right of the shield
  const n = word('AEGIS', 52, 0.22, x, 74);
  const s = word('CORPORATION', 14.5, 0.34, x, 104);
  const width = Math.ceil(x + Math.max(n.width, s.width) + 6);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 120" role="img"><title>Aegis Corporation</title>${mark(v)}<path d="${n.d}" fill="${v.word}"/><path d="${s.d}" fill="${v.sub}"/></svg>\n`;
}

const onLight = { shield: C.sky, letter: '#ffffff', word: C.deep, sub: C.slate };
const onDark = { shield: C.pale, letter: C.sky, word: '#ffffff', sub: '#a9c4da' };

writeFileSync(join(out, 'aegis-mark.svg'), markSvg(onLight));
writeFileSync(join(out, 'aegis-mark-light.svg'), markSvg(onDark));
writeFileSync(join(out, 'aegis-logo.svg'), logoSvg(onLight));
writeFileSync(join(out, 'aegis-logo-light.svg'), logoSvg(onDark));

// PNG copies for documents and handouts (transparent, 1600 px wide).
for (const f of ['aegis-logo', 'aegis-logo-light']) {
  const svg = readFileSync(join(out, f + '.svg'), 'utf8');
  writeFileSync(join(out, f + '.png'), new Resvg(svg, { fitTo: { mode: 'width', value: 1600 } }).render().asPng());
}
console.log('aegis logos written to', out);
