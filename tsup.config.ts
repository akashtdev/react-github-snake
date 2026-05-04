import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/lib/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
  target: 'esnext',
  external: ['react', 'react-dom'],
  injectStyle: false,
  outDir: 'dist',
  esbuildOptions(options) {
    options.mangleProps = /^_/;
    options.legalComments = 'none';
  },
});
