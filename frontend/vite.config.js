import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import viteCompression from "vite-plugin-compression";
import svgr from "vite-plugin-svgr";
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  
  return {
    plugins: [
      react(),
      
      // SVGR Configuration
      svgr({
        svgrOptions: {
          icon: true,
          ref: true,
        },
      }),
      
      // Compression
      viteCompression({
        algorithm: "brotliCompress",
        ext: '.br',
        threshold: 5120,
        deleteOriginFile: false,
        verbose: true,
      }),
      viteCompression({
        algorithm: "gzip",
        ext: '.gz',
        threshold: 5120,
        deleteOriginFile: false,
        verbose: true,
      }),
      
      // PWA Configuration
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
        manifest: {
          name: "Vite PWA Project",
          short_name: "Vite PWA",
          theme_color: "#ffffff",
          icons: [
            { src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
            { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
            { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
            { src: "maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif|pdf)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "large-assets",
                expiration: { maxEntries: 10, maxAgeSeconds: 7 * 24 * 60 * 60 },
              },
            },
            {
              urlPattern: /.*\.(?:js|css)/,
              handler: "NetworkFirst",
              options: {
                cacheName: "static-resources",
              },
            },
          ],
        },
      }),
      
      // Bundle visualizer
      isProd && visualizer({
        filename: 'stats.html',
        gzipSize: true,
        brotliSize: true,
        open: false
      }),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        input: {
          main: "./index.html",
          "service-worker": "./public/service-worker.js",
        },
        output: {
          // Simplified chunking strategy with only confirmed dependencies
          manualChunks: {
            // Put core React in one chunk
            'framework': [
              'react', 
              'react-dom', 
              'react-router-dom'
            ]
            // Note: Other chunks like 'data' and 'utils' removed until we confirm they're installed
          },
          chunkFileNames: isProd ? 'assets/[name].[hash].js' : 'assets/[name].js',
          entryFileNames: isProd ? 'assets/[name].[hash].js' : 'assets/[name].js',
          assetFileNames: isProd ? 'assets/[name].[hash].[ext]' : 'assets/[name].[ext]',
        },
      },
      target: "esnext",
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: isProd,
          drop_debugger: isProd,
          pure_funcs: isProd ? ['console.log', 'console.info', 'console.debug'] : [],
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false,
        },
      },
      sourcemap: !isProd,
    },

    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },

    server: {
      port: 3000,
      headers: {
        "Service-Worker-Allowed": "/",
      },
      mimeTypes: {
        "application/javascript": ["js"],
      },
      proxy: {
        "/api": {
          target: "http://localhost:3028",
          changeOrigin: false,
          secure: false,
        },
      },
      compress: true,
    },

    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },

    base: "/",
  };
});