import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  external: ['jsdom'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true
});
