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
      viteCompression({ algorithm: 'brotliCompress' }),
      viteCompression({ algorithm: 'gzip' }),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: { /* unchanged */ },
        workbox: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: /.*\.js$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'js-chunks',
                expiration: { maxAgeSeconds: 24 * 60 * 60 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif|pdf)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'large-assets',
                expiration: { maxEntries: 10, maxAgeSeconds: 7 * 24 * 60 * 60 },
              },
            },
          ],
        },
      }),
      isProd && visualizer({
        filename: 'stats.html',
        gzipSize: true,
        brotliSize: true,
        open: true, // Open for analysis
      }),
    ],

    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },

    build: {
      sourcemap: !isProd, // Enable in dev for debugging
      rollupOptions: {
        input: {
          main: './index.html',
          'service-worker': './public/service-worker.js',
        },
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) return 'vendor';
            if (id.includes('src/components')) return 'components';
            if (id.includes('src/utils')) return 'utils';
          },
        },
      },
      chunkSizeWarningLimit: 500,
      target: 'esnext',
      minify: 'esbuild',
      terserOptions: {
        compress: {
          drop_console: true,
          dead_code: true,
          unused: true,
        },
      },
    },

    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },

    server: {
      port: 3001,
      headers: {
        "Service-Worker-Allowed": "/",
      },
      mimeTypes: {
        "application/javascript": ["js"],
      },
      proxy: {
        "/api": {
          target: "http://localhost:3021",
          changeOrigin: false,
          secure: false,
        },
      },
      compress: true,
    },

  };
});