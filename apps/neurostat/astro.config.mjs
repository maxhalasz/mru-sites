import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://neurostat-group.github.io',
  output: 'static',
  trailingSlash: 'always',
  build: { sourcemap: false, format: 'directory' },
  vite: { build: { sourcemap: false } },
  integrations: [
    sitemap({ filter: (page) => !/\/(partner|search|leaving)\//.test(page) }),
  ],
});
