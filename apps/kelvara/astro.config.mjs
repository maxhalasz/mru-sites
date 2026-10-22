import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kelvarapetro.github.io',
  output: 'static',
  trailingSlash: 'always',
  build: { sourcemap: false, format: 'directory' },
  vite: { build: { sourcemap: false } },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'no', locales: { no: 'nb-NO', en: 'en-GB' } },
    }),
  ],
});
