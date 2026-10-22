#!/usr/bin/env node
// Usage: node packages/brand/bin/stamp.mjs "USO INTERNO · NÍVEL N3" out.svg [--color #a3202a] [--tilt -4] [--width 1200]
// Writes SVG, or PNG (transparent) when the output name ends in .png.
import { writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import { stampSvg, STAMP_DEFAULT_TEXT } from '../src/stamp.js';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const [, v] = args.splice(i, 2);
  return v;
};
const color = opt('color', undefined);
const tilt = Number(opt('tilt', -4));
const width = Number(opt('width', 1200));
const [text = STAMP_DEFAULT_TEXT, out = 'stamp.svg'] = args;

const svg = stampSvg({ text, color, tilt });
if (out.toLowerCase().endsWith('.png')) {
  writeFileSync(out, new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng());
} else {
  writeFileSync(out, svg);
}
console.log(`wrote ${out}`);
