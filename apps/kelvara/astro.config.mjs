import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kelvarapetro.github.io',
  output: 'static',
  build: { sourcemap: false },
  vite: { build: { sourcemap: false } },
});
