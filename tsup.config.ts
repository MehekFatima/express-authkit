import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['bin/cli.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: false,
  clean: true,
  minify: false,
  target: 'node16'
});
