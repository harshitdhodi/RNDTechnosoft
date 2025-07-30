// vite.config.js
import { defineConfig } from "file:///C:/Users/Keval/VrajeshRndTechnosoft/RNDTechnosoft/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Keval/VrajeshRndTechnosoft/RNDTechnosoft/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///C:/Users/Keval/VrajeshRndTechnosoft/RNDTechnosoft/frontend/node_modules/vite-plugin-pwa/dist/index.js";
import path from "path";
import viteCompression from "file:///C:/Users/Keval/VrajeshRndTechnosoft/RNDTechnosoft/frontend/node_modules/vite-plugin-compression/dist/index.mjs";
import svgr from "file:///C:/Users/Keval/VrajeshRndTechnosoft/RNDTechnosoft/frontend/node_modules/vite-plugin-svgr/dist/index.js";
import { visualizer } from "file:///C:/Users/Keval/VrajeshRndTechnosoft/RNDTechnosoft/frontend/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import critical from "file:///C:/Users/Keval/VrajeshRndTechnosoft/RNDTechnosoft/frontend/node_modules/rollup-plugin-critical/dist/index.js";
import { purgeCss } from "file:///C:/Users/Keval/VrajeshRndTechnosoft/RNDTechnosoft/frontend/node_modules/vite-plugin-tailwind-purgecss/dist/index.js";
import cssInjectedByJsPlugin from "file:///C:/Users/Keval/VrajeshRndTechnosoft/RNDTechnosoft/frontend/node_modules/vite-plugin-css-injected-by-js/dist/esm/index.js";
var __vite_injected_original_dirname = "C:\\Users\\Keval\\VrajeshRndTechnosoft\\RNDTechnosoft\\frontend";
var deferNonCriticalCSS = () => ({
  name: "defer-non-critical-css",
  transformIndexHtml(html, { bundle }) {
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
  }
});
var timestamp = Date.now();
var vite_config_default = defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    // SVGR Configuration
    svgr({
      svgrOptions: {
        icon: true,
        ref: true
      }
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
          { src: "maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
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
                maxAgeSeconds: 7 * 24 * 60 * 60
              }
            }
          },
          {
            urlPattern: /.*\.(?:js|css)/,
            handler: "NetworkFirst",
            options: {
              cacheName: "static-resources"
            }
          }
        ]
      }
    }),
    // Critical CSS (used with SSR or pre-rendered HTML)
    critical({
      criticalUrl: "http://localhost:3021",
      // optional: use your base URL or entry HTML
      criticalBase: "dist/",
      criticalPages: [{ uri: "", template: "index" }],
      critical: {
        inline: true,
        dimensions: [
          { width: 375, height: 667 },
          { width: 1280, height: 720 }
        ],
        extract: false,
        minify: true,
        penthouse: {
          timeout: 6e4,
          forceInclude: [
            ".w-full",
            ".h-\\[300px\\]",
            ".md\\:h-\\[600px\\]",
            ".object-cover",
            ".relative",
            ".absolute",
            ".transition-opacity",
            ".opacity-100",
            ".opacity-0"
          ]
        }
      }
    }),
    // Tailwind PurgeCSS Plugin (Updated)
    purgeCss({
      content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
      safelist: ["html", "body", /^h-/, /^md:/, /^opacity-/, /^transition-/, "object-cover", "absolute", "relative"],
      // Add debugging or verbose output
      verbose: true
      // Check plugin documentation for exact option
    }),
    // Rollup Visualizer Plugin
    visualizer({
      filename: "dist/stats.html",
      open: true
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
                if (assetInfo.name && assetInfo.name.endsWith(".css")) {
                  return `assets/main-DdwcwtZ8-1744602663188.css`;
                }
                return `assets/[name]-[hash]-${timestamp}[extname]`;
              }
            }
          }
        }
      })
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    cssCodeSplit: true,
    // Ensure all CSS is bundled into one file
    rollupOptions: {
      output: {
        manualChunks: () => null
        // Disable all chunk splitting
      }
    }
  },
  server: {
    historyApiFallback: true,
    port: 3001,
    headers: {
      "Service-Worker-Allowed": "/"
    },
    proxy: {
      "/api": {
        target: "http://localhost:3021",
        changeOrigin: false,
        secure: false
      }
    }
  },
  base: "/"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxLZXZhbFxcXFxWcmFqZXNoUm5kVGVjaG5vc29mdFxcXFxSTkRUZWNobm9zb2Z0XFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxLZXZhbFxcXFxWcmFqZXNoUm5kVGVjaG5vc29mdFxcXFxSTkRUZWNobm9zb2Z0XFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9LZXZhbC9WcmFqZXNoUm5kVGVjaG5vc29mdC9STkRUZWNobm9zb2Z0L2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSBcInZpdGUtcGx1Z2luLXB3YVwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gXCJ2aXRlLXBsdWdpbi1jb21wcmVzc2lvblwiO1xyXG5pbXBvcnQgc3ZnciBmcm9tIFwidml0ZS1wbHVnaW4tc3ZnclwiO1xyXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSBcInJvbGx1cC1wbHVnaW4tdmlzdWFsaXplclwiO1xyXG5pbXBvcnQgY3JpdGljYWwgZnJvbSBcInJvbGx1cC1wbHVnaW4tY3JpdGljYWxcIjsgLy8gQ3JpdGljYWwgQ1NTXHJcbmltcG9ydCB7IHB1cmdlQ3NzIH0gZnJvbSBcInZpdGUtcGx1Z2luLXRhaWx3aW5kLXB1cmdlY3NzXCI7IC8vIFVwZGF0ZWQgUHVyZ2VDU1MgaW1wb3J0XHJcbmltcG9ydCBjc3NJbmplY3RlZEJ5SnNQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tY3NzLWluamVjdGVkLWJ5LWpzJztcclxuXHJcbmNvbnN0IGRlZmVyTm9uQ3JpdGljYWxDU1MgPSAoKSA9PiAoe1xyXG4gIG5hbWU6IFwiZGVmZXItbm9uLWNyaXRpY2FsLWNzc1wiLFxyXG4gIHRyYW5zZm9ybUluZGV4SHRtbChodG1sLCB7IGJ1bmRsZSB9KSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhcIkJ1bmRsZTpcIiwgYnVuZGxlKTsgLy8gTG9nIHRoZSBidW5kbGUgb2JqZWN0XHJcbiAgICBpZiAoIWJ1bmRsZSkge1xyXG4gICAgICByZXR1cm4gaHRtbDtcclxuICAgIH1cclxuICAgIGNvbnN0IGNzc0ZpbGUgPSBPYmplY3Qua2V5cyhidW5kbGUpLmZpbmQoKGZpbGUpID0+IGZpbGUuZW5kc1dpdGgoXCIuY3NzXCIpKTtcclxuICAgIGlmIChjc3NGaWxlKSB7XHJcbiAgICAgIHJldHVybiBodG1sLnJlcGxhY2UoXHJcbiAgICAgICAgXCI8L2hlYWQ+XCIsXHJcbiAgICAgICAgYDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiLyR7Y3NzRmlsZX1cIiBtZWRpYT1cInByaW50XCIgb25sb2FkPVwidGhpcy5tZWRpYT0nYWxsJ1wiIC8+PC9oZWFkPmBcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIHJldHVybiBodG1sO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTsgLy8gR2VuZXJhdGUgYSB0aW1lc3RhbXBcclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgY3NzSW5qZWN0ZWRCeUpzUGx1Z2luKCksXHJcbiAgICAvLyBTVkdSIENvbmZpZ3VyYXRpb25cclxuICAgIHN2Z3Ioe1xyXG4gICAgICBzdmdyT3B0aW9uczoge1xyXG4gICAgICAgIGljb246IHRydWUsXHJcbiAgICAgICAgcmVmOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgICAvLyBDb21wcmVzc2lvbiAtIEJyb3RsaSBhbmQgR3ppcFxyXG4gICAgdml0ZUNvbXByZXNzaW9uKHsgYWxnb3JpdGhtOiBcImJyb3RsaUNvbXByZXNzXCIgfSksXHJcbiAgICAvLyB2aXRlQ29tcHJlc3Npb24oeyBhbGdvcml0aG06IFwiZ3ppcFwiIH0pLFxyXG4gICAgLy8gUFdBIENvbmZpZ3VyYXRpb25cclxuICAgIFZpdGVQV0Eoe1xyXG4gICAgICByZWdpc3RlclR5cGU6IFwiYXV0b1VwZGF0ZVwiLFxyXG4gICAgICBpbmNsdWRlQXNzZXRzOiBbXCJmYXZpY29uLmljb1wiLCBcImFwcGxlLXRvdWNoLWljb24ucG5nXCIsIFwibWFzay1pY29uLnN2Z1wiXSxcclxuICAgICAgbWFuaWZlc3Q6IHtcclxuICAgICAgICBuYW1lOiBcIlZpdGUgUFdBIFByb2plY3RcIixcclxuICAgICAgICBzaG9ydF9uYW1lOiBcIlZpdGUgUFdBXCIsXHJcbiAgICAgICAgdGhlbWVfY29sb3I6IFwiI2ZmZmZmZlwiLFxyXG4gICAgICAgIGljb25zOiBbXHJcbiAgICAgICAgICB7IHNyYzogXCJwd2EtNjR4NjQucG5nXCIsIHNpemVzOiBcIjY0eDY0XCIsIHR5cGU6IFwiaW1hZ2UvcG5nXCIgfSxcclxuICAgICAgICAgIHsgc3JjOiBcInB3YS0xOTJ4MTkyLnBuZ1wiLCBzaXplczogXCIxOTJ4MTkyXCIsIHR5cGU6IFwiaW1hZ2UvcG5nXCIgfSxcclxuICAgICAgICAgIHsgc3JjOiBcInB3YS01MTJ4NTEyLnBuZ1wiLCBzaXplczogXCI1MTJ4NTEyXCIsIHR5cGU6IFwiaW1hZ2UvcG5nXCIsIHB1cnBvc2U6IFwiYW55XCIgfSxcclxuICAgICAgICAgIHsgc3JjOiBcIm1hc2thYmxlLWljb24tNTEyeDUxMi5wbmdcIiwgc2l6ZXM6IFwiNTEyeDUxMlwiLCB0eXBlOiBcImltYWdlL3BuZ1wiLCBwdXJwb3NlOiBcIm1hc2thYmxlXCIgfSxcclxuICAgICAgICBdLFxyXG4gICAgICB9LFxyXG4gICAgICB3b3JrYm94OiB7XHJcbiAgICAgICAgbWF4aW11bUZpbGVTaXplVG9DYWNoZUluQnl0ZXM6IDUgKiAxMDI0ICogMTAyNCxcclxuICAgICAgICBydW50aW1lQ2FjaGluZzogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAvLipcXC4oPzpwbmd8anBnfGpwZWd8c3ZnfGdpZnxwZGYpJC8sXHJcbiAgICAgICAgICAgIGhhbmRsZXI6IFwiQ2FjaGVGaXJzdFwiLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiBcImxhcmdlLWFzc2V0c1wiLFxyXG4gICAgICAgICAgICAgIGV4cGlyYXRpb246IHtcclxuICAgICAgICAgICAgICAgIG1heEVudHJpZXM6IDEwLFxyXG4gICAgICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogNyAqIDI0ICogNjAgKiA2MCxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdXJsUGF0dGVybjogLy4qXFwuKD86anN8Y3NzKS8sXHJcbiAgICAgICAgICAgIGhhbmRsZXI6IFwiTmV0d29ya0ZpcnN0XCIsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICBjYWNoZU5hbWU6IFwic3RhdGljLXJlc291cmNlc1wiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICBdLFxyXG4gICAgICB9LFxyXG4gICAgfSksIFxyXG4gICAgLy8gQ3JpdGljYWwgQ1NTICh1c2VkIHdpdGggU1NSIG9yIHByZS1yZW5kZXJlZCBIVE1MKVxyXG4gICAgY3JpdGljYWwoe1xyXG4gICAgICBjcml0aWNhbFVybDogXCJodHRwOi8vbG9jYWxob3N0OjMwMjFcIiwgLy8gb3B0aW9uYWw6IHVzZSB5b3VyIGJhc2UgVVJMIG9yIGVudHJ5IEhUTUxcclxuICAgICAgY3JpdGljYWxCYXNlOiBcImRpc3QvXCIsXHJcbiAgICAgIGNyaXRpY2FsUGFnZXM6IFt7IHVyaTogXCJcIiwgdGVtcGxhdGU6IFwiaW5kZXhcIiB9XSxcclxuICAgICAgY3JpdGljYWw6IHtcclxuICAgICAgICBpbmxpbmU6IHRydWUsXHJcbiAgICAgICAgZGltZW5zaW9uczogW1xyXG4gICAgICAgICAgeyB3aWR0aDogMzc1LCBoZWlnaHQ6IDY2NyB9LFxyXG4gICAgICAgICAgeyB3aWR0aDogMTI4MCwgaGVpZ2h0OiA3MjAgfSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIGV4dHJhY3Q6IGZhbHNlLFxyXG4gICAgICAgIG1pbmlmeTogdHJ1ZSxcclxuICAgICAgICBwZW50aG91c2U6IHtcclxuICAgICAgICAgIHRpbWVvdXQ6IDYwMDAwLFxyXG4gICAgICAgICAgZm9yY2VJbmNsdWRlOiBbXHJcbiAgICAgICAgICAgIFwiLnctZnVsbFwiLFxyXG4gICAgICAgICAgICBcIi5oLVxcXFxbMzAwcHhcXFxcXVwiLFxyXG4gICAgICAgICAgICBcIi5tZFxcXFw6aC1cXFxcWzYwMHB4XFxcXF1cIixcclxuICAgICAgICAgICAgXCIub2JqZWN0LWNvdmVyXCIsXHJcbiAgICAgICAgICAgIFwiLnJlbGF0aXZlXCIsXHJcbiAgICAgICAgICAgIFwiLmFic29sdXRlXCIsXHJcbiAgICAgICAgICAgIFwiLnRyYW5zaXRpb24tb3BhY2l0eVwiLFxyXG4gICAgICAgICAgICBcIi5vcGFjaXR5LTEwMFwiLFxyXG4gICAgICAgICAgICBcIi5vcGFjaXR5LTBcIixcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gICAgLy8gVGFpbHdpbmQgUHVyZ2VDU1MgUGx1Z2luIChVcGRhdGVkKVxyXG4gICAgcHVyZ2VDc3Moe1xyXG4gICAgICBjb250ZW50OiBbXCIuL2luZGV4Lmh0bWxcIiwgXCIuL3NyYy8qKi8qLntqcyxqc3gsdHMsdHN4fVwiXSxcclxuICAgICAgc2FmZWxpc3Q6IFtcImh0bWxcIiwgXCJib2R5XCIsIC9eaC0vLCAvXm1kOi8sIC9eb3BhY2l0eS0vLCAvXnRyYW5zaXRpb24tLywgXCJvYmplY3QtY292ZXJcIiwgXCJhYnNvbHV0ZVwiLCBcInJlbGF0aXZlXCJdLFxyXG4gICAgICAvLyBBZGQgZGVidWdnaW5nIG9yIHZlcmJvc2Ugb3V0cHV0XHJcbiAgICAgIHZlcmJvc2U6IHRydWUsIC8vIENoZWNrIHBsdWdpbiBkb2N1bWVudGF0aW9uIGZvciBleGFjdCBvcHRpb25cclxuICAgIH0pLFxyXG4gICAgLy8gUm9sbHVwIFZpc3VhbGl6ZXIgUGx1Z2luXHJcbiAgICB2aXN1YWxpemVyKHtcclxuICAgICAgZmlsZW5hbWU6IFwiZGlzdC9zdGF0cy5odG1sXCIsXHJcbiAgICAgIG9wZW46IHRydWUsXHJcbiAgICB9KSxcclxuICAgIGRlZmVyTm9uQ3JpdGljYWxDU1MoKSxcclxuICAgIC8vIEFwcGVuZCBidWlsZCB0aW1lc3RhbXBcclxuICAgIHtcclxuICAgICAgbmFtZTogXCJhcHBlbmQtYnVpbGQtdGltZXN0YW1wXCIsXHJcbiAgICAgIGNvbmZpZzogKCkgPT4gKHtcclxuICAgICAgICBidWlsZDoge1xyXG4gICAgICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAgICAgICBlbnRyeUZpbGVOYW1lczogYGFzc2V0cy9bbmFtZV0tW2hhc2hdLSR7dGltZXN0YW1wfS5qc2AsXHJcbiAgICAgICAgICAgICAgY2h1bmtGaWxlTmFtZXM6IGBhc3NldHMvW25hbWVdLVtoYXNoXS0ke3RpbWVzdGFtcH0uanNgLFxyXG4gICAgICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXNzZXRJbmZvLm5hbWUgJiYgYXNzZXRJbmZvLm5hbWUuZW5kc1dpdGgoJy5jc3MnKSkge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gYGFzc2V0cy9tYWluLURkd2N3dFo4LTE3NDQ2MDI2NjMxODguY3NzYDsgLy8gRm9yY2Ugc2luZ2xlIENTUyBmaWxlIG5hbWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBgYXNzZXRzL1tuYW1lXS1baGFzaF0tJHt0aW1lc3RhbXB9W2V4dG5hbWVdYDtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9KSxcclxuICAgIH0sXHJcbiAgXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgY3NzQ29kZVNwbGl0OiB0cnVlLCAvLyBFbnN1cmUgYWxsIENTUyBpcyBidW5kbGVkIGludG8gb25lIGZpbGVcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgbWFudWFsQ2h1bmtzOiAoKSA9PiBudWxsLCAvLyBEaXNhYmxlIGFsbCBjaHVuayBzcGxpdHRpbmdcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIGhpc3RvcnlBcGlGYWxsYmFjazogdHJ1ZSxcclxuICAgIHBvcnQ6IDMwMDEsXHJcbiAgICBoZWFkZXJzOiB7XHJcbiAgICAgIFwiU2VydmljZS1Xb3JrZXItQWxsb3dlZFwiOiBcIi9cIixcclxuICAgIH0sXHJcbiAgICBwcm94eToge1xyXG4gICAgICBcIi9hcGlcIjoge1xyXG4gICAgICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjMwMjFcIixcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IGZhbHNlLFxyXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYmFzZTogXCIvXCIsXHJcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFcsU0FBUyxvQkFBb0I7QUFDelksT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUN4QixPQUFPLFVBQVU7QUFDakIsT0FBTyxxQkFBcUI7QUFDNUIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsa0JBQWtCO0FBQzNCLE9BQU8sY0FBYztBQUNyQixTQUFTLGdCQUFnQjtBQUN6QixPQUFPLDJCQUEyQjtBQVRsQyxJQUFNLG1DQUFtQztBQVd6QyxJQUFNLHNCQUFzQixPQUFPO0FBQUEsRUFDakMsTUFBTTtBQUFBLEVBQ04sbUJBQW1CLE1BQU0sRUFBRSxPQUFPLEdBQUc7QUFFbkMsUUFBSSxDQUFDLFFBQVE7QUFDWCxhQUFPO0FBQUEsSUFDVDtBQUNBLFVBQU0sVUFBVSxPQUFPLEtBQUssTUFBTSxFQUFFLEtBQUssQ0FBQyxTQUFTLEtBQUssU0FBUyxNQUFNLENBQUM7QUFDeEUsUUFBSSxTQUFTO0FBQ1gsYUFBTyxLQUFLO0FBQUEsUUFDVjtBQUFBLFFBQ0EsaUNBQWlDLE9BQU87QUFBQSxNQUMxQztBQUFBLElBQ0Y7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUNGO0FBRUEsSUFBTSxZQUFZLEtBQUssSUFBSTtBQUMzQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixzQkFBc0I7QUFBQTtBQUFBLElBRXRCLEtBQUs7QUFBQSxNQUNILGFBQWE7QUFBQSxRQUNYLE1BQU07QUFBQSxRQUNOLEtBQUs7QUFBQSxNQUNQO0FBQUEsSUFDRixDQUFDO0FBQUE7QUFBQSxJQUVELGdCQUFnQixFQUFFLFdBQVcsaUJBQWlCLENBQUM7QUFBQTtBQUFBO0FBQUEsSUFHL0MsUUFBUTtBQUFBLE1BQ04sY0FBYztBQUFBLE1BQ2QsZUFBZSxDQUFDLGVBQWUsd0JBQXdC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
