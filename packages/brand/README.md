# @mru/brand

Logos and the NeuroStat internal-use stamp.

## Logos (`logos/`)

Redrawn as SVG from the brand files. `-light` variants are for dark backgrounds.

- `kelvara-horizontal`, `kelvara-vertical`, `kelvara-mark`
- `neurostat-logo` (mark + wordmark), `neurostat-mark`

## Stamp

The text under the rule is editable. Everything else (frame, mark, NEUROSTAT, rule) is fixed.

```
npm run stamp -- "USO INTERNO · NÍVEL N3" stamp.svg
npm run stamp -- "CONFIDENCIAL · NÍVEL N4" stamp.png --width 1200
```

Options: `--color #a3202a`, `--tilt -4` (degrees, 0 for upright), `--width` (PNG only).
The PNG is transparent. Text is converted to uppercase and long text shrinks to fit the rule.
Letters must exist in Oswald Latin (accents are fine, symbols like ★ are not).

In code: `import { stampSvg } from '@mru/brand'; stampSvg({ text })`.
The text is drawn as outlines, so the stamp looks the same without any font installed.

Portal documents: the stamp text comes from each document's `classification` field.

## Aegis Corporation

Security and logistics operator behind NeuroStat's field work. The logo is the one Max supplied (a raster, 1024 px); there is no other Aegis logo.

- `aegis-logo-original.png`: the artwork exactly as supplied (black on white)
- `aegis-logo.png` (black), `aegis-logo-blue.png` (light blue `#4da3e0`), `aegis-logo-light.png` (white, for dark backgrounds): the same artwork on a transparent background
- Aegis materials use a light, open blue, far from NeuroStat's navy.

Aegis has no website. The logo is for handouts and props, not for the published sites.
