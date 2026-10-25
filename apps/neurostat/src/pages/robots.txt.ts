import { PUBLIC_LAUNCH } from '../data/launch';

export function GET() {
  const body = PUBLIC_LAUNCH
    ? 'User-agent: *\nDisallow: /partner/\nDisallow: /search/\n\nSitemap: https://neurostat-group.github.io/sitemap-index.xml\n'
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
