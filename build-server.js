import { build } from 'esbuild';
import { resolve } from 'path';

await build({
  entryPoints: ['server/production.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outdir: 'dist',
  packages: 'external',
  external: [
    '@tensorflow/tfjs-node',
    '@tensorflow/tfjs',
    'canvas',
    'bufferutil',
    'utf-8-validate',
    'express',
    'multer',
    'vite',
    'nanoid',
    '../vite.config'
  ],
  alias: {
    '@shared': resolve('./shared'),
    '@': resolve('./client/src')
  },
  minify: true,
  sourcemap: false,
  logLevel: 'info',
  define: {
    'import.meta.dirname': '__dirname'
  },
  loader: {
    '.ts': 'ts'
  }
});

console.log('✅ Server build complete');