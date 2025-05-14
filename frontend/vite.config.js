import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import viteCompression from 'vite-plugin-compression';
import svgr from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [
      react(),
      svgr({ svgrOptions: { icon: true, ref: true } }),
      viteCompression({
        algorithm: 'brotliCompress',
        threshold: 512,
        compressionOptions: { level: 11 },
        deleteOriginFile: false,
      }),
      viteCompression({
        algorithm: 'gzip',
        threshold: 512,
        compressionOptions: { level: 9 },
        deleteOriginFile: false,
      }),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: { /* unchanged */ },
        workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          runtimeCaching: [
            // ... (keeping your existing runtimeCaching config)
          ],
        },
      }),
      isProd &&
        visualizer({
          filename: 'stats.html',
          gzipSize: true,
          brotliSize: true,
          open: false,
        }),
    ],

    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },

    build: {
      sourcemap: true, // Enable source maps
      chunkSizeWarningLimit: 600, // Set chunk size warning limit
      target: 'esnext', // Target modern browsers
      minify: 'terser', // Use terser for minification
      terserOptions: {
        compress: {
          drop_console: true, // Remove console logs
          pure_funcs: ['console.log', 'console.info'], // Remove specific console functions
        },
      },
      rollupOptions: {
        input: {
          main: './index.html', // Define the main entry point
        },
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'], // Vendor chunk
            utils: ['axios'], // Utility chunk
          },
          chunkFileNames: 'assets/[name]-[hash].js', // Chunk file naming pattern
          entryFileNames: 'assets/[name]-[hash].js', // Entry file naming pattern
        },
      },
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'react-quill', // Added for better dev-time optimization
        'react-icons', // Added for better dev-time optimization
      ],
      esbuildOptions: {
        target: 'esnext',
        define: {
          'process.env.NODE_ENV': JSON.stringify(mode),
          __DEV__: JSON.stringify(mode !== 'production'),
        },
      },
    },

    server: {
      port: 3001,
      headers: { 'Service-Worker-Allowed': '/' },
      mimeTypes: { 'application/javascript': ['js'] },
      proxy: {
        '/api': {
          target: 'http://localhost:3021',
          changeOrigin: false,
          secure: false,
        },
      },
      compress: true,
    },

    preview: {
      headers: {
        '/*.js': { 'Cache-Control': 'public, max-age=31536000, immutable' },
        '/*.css': { 'Cache-Control': 'public, max-age=31536000, immutable' },
        '/*.woff2': { 'Cache-Control': 'public, max-age=31536000, immutable' },
        '/*.webm': { 'Cache-Control': 'public, max-age=604800' },
        '/*.webp': { 'Cache-Control': 'public, max-age=604800' },
        '/*.html': { 'Cache-Control': 'public, max-age=0, must-revalidate' },
        '/service-worker.js': { 'Cache-Control': 'public, max-age=0, must-revalidate' },
      },
    },
  };
});