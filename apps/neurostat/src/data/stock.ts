// Share price history for NEUS, in CHF. Synthetic, generated once at build time from fixed anchors.
// The series ends on 19 October 2028. A single-day drop on 12 March 2026 reflects the Phase III result.

export interface Point { date: string; close: number }

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const anchors: [string, number][] = [
  ['2010-06-18', 24.0], ['2011-06-30', 21.5], ['2012-12-31', 22.8], ['2014-06-30', 31.0],
  ['2015-12-31', 41.0], ['2017-09-29', 54.0], ['2019-03-29', 66.0], ['2020-10-30', 80.0],
  ['2021-12-31', 92.0], ['2023-06-30', 104.0], ['2025-12-31', 117.0], ['2026-03-11', 116.0],
  ['2026-03-12', 74.0], ['2026-12-31', 70.0], ['2027-12-31', 79.0], ['2028-06-30', 81.0],
  ['2028-10-18', 83.83], ['2028-10-19', 84.35],
];

const day = 86400000;
const t = (s: string) => Date.parse(s + 'T00:00:00Z');
const iso = (ms: number) => new Date(ms).toISOString().slice(0, 10);

function target(ms: number): number {
  for (let i = 1; i < anchors.length; i++) {
    const [d1, p1] = anchors[i];
    const [d0, p0] = anchors[i - 1];
    if (ms <= t(d1)) {
      const f = (ms - t(d0)) / Math.max(1, t(d1) - t(d0));
      return Math.exp(Math.log(p0) + f * (Math.log(p1) - Math.log(p0)));
    }
  }
  return anchors[anchors.length - 1][1];
}

function build(): Point[] {
  const rand = mulberry32(20281019);
  const out: Point[] = [];
  let dev = 0;
  for (let ms = t(anchors[0][0]); ms <= t('2028-10-19'); ms += day) {
    const dow = new Date(ms).getUTCDay();
    if (dow === 0 || dow === 6) continue;
    const date = iso(ms);
    const shock = (rand() + rand() + rand() - 1.5) * 0.017;
    dev = dev * 0.97 + shock;
    let close = target(ms) * Math.exp(dev);
    if (date === '2026-03-11') close = 116.2;
    if (date === '2026-03-12') close = 73.9;
    out.push({ date, close: Math.round(close * 100) / 100 });
  }
  out[out.length - 1].close = 84.35;
  out[out.length - 2].close = 83.83;
  return out;
}

export const daily: Point[] = build();
export const last = daily[daily.length - 1];
export const prev = daily[daily.length - 2];
export const change = Math.round((last.close - prev.close) * 100) / 100;
export const changePct = Math.round(((last.close - prev.close) / prev.close) * 10000) / 100;

export function range(key: '1M' | '1Y' | '5Y' | 'MAX'): Point[] {
  const end = t(last.date);
  const span = { '1M': 31, '1Y': 365, '5Y': 365 * 5, MAX: 99999 }[key];
  const from = end - span * day;
  const sel = daily.filter((p) => t(p.date) >= from);
  const step = key === '5Y' ? 5 : key === 'MAX' ? 10 : 1;
  const out = sel.filter((_, i) => i % step === 0);
  if (out[out.length - 1] !== sel[sel.length - 1]) out.push(sel[sel.length - 1]);
  return out;
}
