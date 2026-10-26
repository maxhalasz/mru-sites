// The closing prices behind the share price chart, as one small script. The page only loads it when the
// shared date is not the default one, to redraw the ticker and the charts for that date.
import { daily } from '../../data/stock';

export function GET() {
  const body = 'window.NEUS_PX=' + JSON.stringify({ start: daily[0].date, closes: daily.map((p) => Math.round(p.close * 100)) }) + ';';
  return new Response(body, { headers: { 'Content-Type': 'text/javascript; charset=utf-8' } });
}
