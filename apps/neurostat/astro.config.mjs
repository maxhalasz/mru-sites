import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://neurostat-group.github.io',
  output: 'static',
  build: { sourcemap: false },
  vite: { build: { sourcemap: false } },
});
