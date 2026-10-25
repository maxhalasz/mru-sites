// Makes the soft-focus version of a hero photo, so the blur is smooth at any screen size.
// Browsers blur the JPEG blocks of a compressed photo into a blocky, "pixelated" look; blurring the
// full-quality original here and adding a little grain avoids that.
// Usage: node scripts/blur-hero.mjs apps/kelvara odemark-a-natt.jpg
import sharp from 'sharp';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const [, , appDir, ...files] = process.argv;
if (!appDir || !files.length) { console.error('usage: blur-hero.mjs <app dir> <file> [...]'); process.exit(2); }

const outDir = join(appDir, 'public', 'img', 'generated');
mkdirSync(outDir, { recursive: true });

for (const file of files) {
  const src = join(appDir, 'public', 'img', file);
  const out = join(outDir, file);
  if (!existsSync(src)) { rmSync(out, { force: true }); continue; }
  const width = Math.min(2400, (await sharp(src).metadata()).width);
  const blurred = await sharp(src).resize({ width }).blur(9).toBuffer({ resolveWithObject: true });
  const grain = await sharp({
    create: { width: blurred.info.width, height: blurred.info.height, channels: 3, background: { r: 128, g: 128, b: 128 }, noise: { type: 'gaussian', mean: 128, sigma: 7 } },
  }).png().toBuffer();
  await sharp(blurred.data)
    .composite([{ input: grain, blend: 'soft-light' }])
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4', mozjpeg: true })
    .toFile(out);
  console.log(`blur-hero: ${out} (${blurred.info.width}x${blurred.info.height})`);
}
