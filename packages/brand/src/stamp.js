// "NEUROSTAT / <text>" rubber stamp, rendered as an SVG with the text outlined,
// so it looks the same everywhere and needs no font on the viewer's machine.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import opentype from 'opentype.js';
import { NEUROSTAT_MARK, neurostatMarkPaths } from './mark.js';

export const STAMP_DEFAULT_TEXT = 'USO INTERNO · NÍVEL N3';
export const STAMP_COLOR = '#a3202a';

const require = createRequire(import.meta.url);
const fontFile = require.resolve('@fontsource/oswald/files/oswald-latin-500-normal.woff');
const buf = readFileSync(fontFile);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const CAP = font.tables.os2.sCapHeight / font.unitsPerEm;

// Layout measured from the original stamp artwork, in px relative to the frame centre.
const L = {
  frameOuter: { w: 1687.3, h: 1517.3, stroke: 18.1 },
  frameInner: { w: 1602.3, h: 1432.3, stroke: 2.7 },
  mark: { left: -363.6, top: -555.6, width: 732 },
  word: { text: 'NEUROSTAT', cap: 145, baseline: 303.9, cx: 4.9, trackEm: 0.196 },
  rule: { x1: -580.6, x2: 580.4, y: 414.9, thick: 8 },
  label: { cap: 57, baseline: 584.9, cx: 1.4, trackEm: 0.291, maxWidth: 1090 },
};

function outline(text, size, trackEm, cx, baseline) {
  const scale = size / font.unitsPerEm;
  const track = trackEm * size;
  let x = 0;
  let left = null;
  let right = 0;
  const glyphs = [];
  for (const ch of text) {
    const g = font.charToGlyph(ch);
    if (g.index === 0) throw new Error(`Stamp text: character "${ch}" is not in the stamp font`);
    glyphs.push({ g, x });
    const b = g.getBoundingBox();
    if (b.x2 > b.x1) {
      if (left === null) left = x + b.x1 * scale;
      right = x + b.x2 * scale;
    }
    x += g.advanceWidth * scale + track;
  }
  const inkWidth = right - left;
  const x0 = cx - inkWidth / 2 - left;
  const d = glyphs.map(({ g, x: gx }) => g.getPath(x0 + gx, baseline, size).toPathData(2)).join('');
  return { d, inkWidth };
}

export function stampSvg({ text = STAMP_DEFAULT_TEXT, color = STAMP_COLOR, tilt = -4 } = {}) {
  const label = String(text).trim().toUpperCase().replace(/\s+/g, ' ');
  if (!label) throw new Error('Stamp text is empty');

  const wordSize = L.word.cap / CAP;
  const word = outline(L.word.text, wordSize, L.word.trackEm, L.word.cx, L.word.baseline);

  // Shrink long text so it stays inside the rule.
  let labelSize = L.label.cap / CAP;
  let lab = outline(label, labelSize, L.label.trackEm, L.label.cx, L.label.baseline);
  if (lab.inkWidth > L.label.maxWidth) {
    labelSize *= L.label.maxWidth / lab.inkWidth;
    lab = outline(label, labelSize, L.label.trackEm, L.label.cx, L.label.baseline);
  }

  const s = L.mark.width / NEUROSTAT_MARK.width;
  const rot = (tilt * Math.PI) / 180;
  const hw = L.frameOuter.w / 2;
  const hh = L.frameOuter.h / 2;
  const xs = [];
  const ys = [];
  for (const [px, py] of [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]]) {
    xs.push(px * Math.cos(rot) - py * Math.sin(rot));
    ys.push(px * Math.sin(rot) + py * Math.cos(rot));
  }
  const vx = Math.min(...xs);
  const vy = Math.min(...ys);
  const vw = Math.max(...xs) - vx;
  const vh = Math.max(...ys) - vy;
  const r = (n) => Math.round(n * 10) / 10;

  const f1 = L.frameOuter;
  const f2 = L.frameInner;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(vx)} ${r(vy)} ${r(vw)} ${r(vh)}" role="img" aria-label="NEUROSTAT ${label}">` +
    `<g fill="${color}" transform="rotate(${tilt})">` +
    `<rect x="${r(-(f1.w - f1.stroke) / 2)}" y="${r(-(f1.h - f1.stroke) / 2)}" width="${r(f1.w - f1.stroke)}" height="${r(f1.h - f1.stroke)}" fill="none" stroke="${color}" stroke-width="${f1.stroke}"/>` +
    `<rect x="${r(-(f2.w - f2.stroke) / 2)}" y="${r(-(f2.h - f2.stroke) / 2)}" width="${r(f2.w - f2.stroke)}" height="${r(f2.h - f2.stroke)}" fill="none" stroke="${color}" stroke-width="${f2.stroke}"/>` +
    `<g transform="translate(${L.mark.left} ${L.mark.top}) scale(${r(s * 10000) / 10000}) translate(${-NEUROSTAT_MARK.x} ${-NEUROSTAT_MARK.y})">${neurostatMarkPaths()}</g>` +
    `<path d="${word.d}"/>` +
    `<rect x="${L.rule.x1}" y="${r(L.rule.y - L.rule.thick / 2)}" width="${r(L.rule.x2 - L.rule.x1)}" height="${L.rule.thick}"/>` +
    `<path d="${lab.d}"/>` +
    `</g></svg>`
  );
}
