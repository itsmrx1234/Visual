import { build } from 'esbuild';

await build({
  entryPoints: ['server/index.ts'],
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
    'utf-8-validate'
  ],
  minify: true,
  sourcemap: false,
  logLevel: 'info'
});

console.log('✅ Server build complete');