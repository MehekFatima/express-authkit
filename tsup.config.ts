import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts', 'bin/cli.ts'],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  // dts: true,
  splitting: false,
  minify: false,
  clean: true,
  target: 'node16',
});
