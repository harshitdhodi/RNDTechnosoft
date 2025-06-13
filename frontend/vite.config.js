import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import viteCompression from "vite-plugin-compression";
import svgr from "vite-plugin-svgr";
import { visualizer } from "rollup-plugin-visualizer";
import critical from "rollup-plugin-critical"; // Critical CSS
import { purgeCss } from "vite-plugin-tailwind-purgecss"; // Updated PurgeCSS import
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

const deferNonCriticalCSS = () => ({
  name: "defer-non-critical-css",
  transformIndexHtml(html, { bundle }) {
    // console.log("Bundle:", bundle); // Log the bundle object
    if (!bundle) {
      return html;
    }
    const cssFile = Object.keys(bundle).find((file) => file.endsWith(".css"));
    if (cssFile) {
      return html.replace(
        "</head>",
        `<link rel="stylesheet" href="/${cssFile}" media="print" onload="this.media='all'" /></head>`
      );
    }
    return html;
  },
});

const timestamp = Date.now(); // Generate a timestamp
export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    // SVGR Configuration
    svgr({
      svgrOptions: {
        icon: true,
        ref: true,
      },
    }),
    // Compression - Brotli and Gzip
    viteCompression({ algorithm: "brotliCompress" }),
    // viteCompression({ algorithm: "gzip" }),
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
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif|pdf)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "large-assets",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 7 * 24 * 60 * 60,
              },
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
    // Critical CSS (used with SSR or pre-rendered HTML)
    critical({
      criticalUrl: "http://localhost:3021", // optional: use your base URL or entry HTML
      criticalBase: "dist/",
      criticalPages: [{ uri: "", template: "index" }],
      critical: {
        inline: true,
        dimensions: [
          { width: 375, height: 667 },
          { width: 1280, height: 720 },
        ],
        extract: false,
        minify: true,
        penthouse: {
          timeout: 60000,
          forceInclude: [
            ".w-full",
            ".h-\\[300px\\]",
            ".md\\:h-\\[600px\\]",
            ".object-cover",
            ".relative",
            ".absolute",
            ".transition-opacity",
            ".opacity-100",
            ".opacity-0",
          ],
        },
      },
    }),
    // Tailwind PurgeCSS Plugin (Updated)
    purgeCss({
      content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
      safelist: ["html", "body", /^h-/, /^md:/, /^opacity-/, /^transition-/, "object-cover", "absolute", "relative"],
      // Add debugging or verbose output
      verbose: true, // Check plugin documentation for exact option
    }),
    // Rollup Visualizer Plugin
    visualizer({
      filename: "dist/stats.html",
      open: true,
    }),
    deferNonCriticalCSS(),
    // Append build timestamp
    {
      name: "append-build-timestamp",
      config: () => ({
        build: {
          rollupOptions: {
            output: {
              entryFileNames: `assets/[name]-[hash]-${timestamp}.js`,
              chunkFileNames: `assets/[name]-[hash]-${timestamp}.js`,
              assetFileNames: (assetInfo) => {
                if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                  return `assets/main-DdwcwtZ8-1744602663188.css`; // Force single CSS file name
                }
                return `assets/[name]-[hash]-${timestamp}[extname]`;
              },
            },
          },
        },
      }),
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    cssCodeSplit: true, // Ensure all CSS is bundled into one file
    rollupOptions: {
      output: {
        manualChunks: () => null, // Disable all chunk splitting
      },
    },
  },
  server: {
    historyApiFallback: true,
    port: 3001,
    headers: {
      "Service-Worker-Allowed": "/",
    },
    proxy: {
      "/api": {
        target: "http://localhost:3021",
        changeOrigin: false,
        secure: false,
      },
    },
  },
  base: "/",
});