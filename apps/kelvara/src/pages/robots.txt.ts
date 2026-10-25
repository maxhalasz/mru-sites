import { PUBLIC_LAUNCH } from '../launch';

export function GET() {
  const body = PUBLIC_LAUNCH
    ? 'User-agent: *\nAllow: /\n\nSitemap: https://kelvarapetro.github.io/sitemap-index.xml\n'
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
