import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['bin/cli.ts', 'index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  minify: false,
  target: 'node16'
});
