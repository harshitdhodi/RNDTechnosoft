// vite.config.js
import { defineConfig } from "file:///C:/Users/Admin/Desktop/RND/RNDTechnosoft/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Admin/Desktop/RND/RNDTechnosoft/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///C:/Users/Admin/Desktop/RND/RNDTechnosoft/frontend/node_modules/vite-plugin-pwa/dist/index.js";
import path from "path";
import viteCompression from "file:///C:/Users/Admin/Desktop/RND/RNDTechnosoft/frontend/node_modules/vite-plugin-compression/dist/index.mjs";
import svgr from "file:///C:/Users/Admin/Desktop/RND/RNDTechnosoft/frontend/node_modules/vite-plugin-svgr/dist/index.js";
import { visualizer } from "file:///C:/Users/Admin/Desktop/RND/RNDTechnosoft/frontend/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import critical from "file:///C:/Users/Admin/Desktop/RND/RNDTechnosoft/frontend/node_modules/rollup-plugin-critical/dist/index.js";
import { purgeCss } from "file:///C:/Users/Admin/Desktop/RND/RNDTechnosoft/frontend/node_modules/vite-plugin-tailwind-purgecss/dist/index.js";
import cssInjectedByJsPlugin from "file:///C:/Users/Admin/Desktop/RND/RNDTechnosoft/frontend/node_modules/vite-plugin-css-injected-by-js/dist/esm/index.js";
import postcss from "vite-plugin-postcss";
var __vite_injected_original_dirname = "C:\\Users\\Admin\\Desktop\\RND\\RNDTechnosoft\\frontend";
var deferNonCriticalCSS = () => ({
  name: "defer-non-critical-css",
  transformIndexHtml(html, { bundle }) {
    console.log("Bundle:", bundle);
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
    viteCompression({ algorithm: "gzip" }),
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
      criticalUrl: "http://localhost:3028",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBZG1pblxcXFxEZXNrdG9wXFxcXFJORFxcXFxSTkRUZWNobm9zb2Z0XFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxBZG1pblxcXFxEZXNrdG9wXFxcXFJORFxcXFxSTkRUZWNobm9zb2Z0XFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9BZG1pbi9EZXNrdG9wL1JORC9STkRUZWNobm9zb2Z0L2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSBcInZpdGUtcGx1Z2luLXB3YVwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gXCJ2aXRlLXBsdWdpbi1jb21wcmVzc2lvblwiO1xyXG5pbXBvcnQgc3ZnciBmcm9tIFwidml0ZS1wbHVnaW4tc3ZnclwiO1xyXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSBcInJvbGx1cC1wbHVnaW4tdmlzdWFsaXplclwiO1xyXG5pbXBvcnQgY3JpdGljYWwgZnJvbSBcInJvbGx1cC1wbHVnaW4tY3JpdGljYWxcIjsgLy8gQ3JpdGljYWwgQ1NTXHJcbmltcG9ydCB7IHB1cmdlQ3NzIH0gZnJvbSBcInZpdGUtcGx1Z2luLXRhaWx3aW5kLXB1cmdlY3NzXCI7IC8vIFVwZGF0ZWQgUHVyZ2VDU1MgaW1wb3J0XHJcbmltcG9ydCBjc3NJbmplY3RlZEJ5SnNQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tY3NzLWluamVjdGVkLWJ5LWpzJztcclxuXHJcbmNvbnN0IGRlZmVyTm9uQ3JpdGljYWxDU1MgPSAoKSA9PiAoe1xyXG4gIG5hbWU6IFwiZGVmZXItbm9uLWNyaXRpY2FsLWNzc1wiLFxyXG4gIHRyYW5zZm9ybUluZGV4SHRtbChodG1sLCB7IGJ1bmRsZSB9KSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkJ1bmRsZTpcIiwgYnVuZGxlKTsgLy8gTG9nIHRoZSBidW5kbGUgb2JqZWN0XHJcbiAgICBpZiAoIWJ1bmRsZSkge1xyXG4gICAgICByZXR1cm4gaHRtbDtcclxuICAgIH1cclxuICAgIGNvbnN0IGNzc0ZpbGUgPSBPYmplY3Qua2V5cyhidW5kbGUpLmZpbmQoKGZpbGUpID0+IGZpbGUuZW5kc1dpdGgoXCIuY3NzXCIpKTtcclxuICAgIGlmIChjc3NGaWxlKSB7XHJcbiAgICAgIHJldHVybiBodG1sLnJlcGxhY2UoXHJcbiAgICAgICAgXCI8L2hlYWQ+XCIsXHJcbiAgICAgICAgYDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiLyR7Y3NzRmlsZX1cIiBtZWRpYT1cInByaW50XCIgb25sb2FkPVwidGhpcy5tZWRpYT0nYWxsJ1wiIC8+PC9oZWFkPmBcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIHJldHVybiBodG1sO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTsgLy8gR2VuZXJhdGUgYSB0aW1lc3RhbXBcclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgY3NzSW5qZWN0ZWRCeUpzUGx1Z2luKCksXHJcbiAgICAvLyBTVkdSIENvbmZpZ3VyYXRpb25cclxuICAgIHN2Z3Ioe1xyXG4gICAgICBzdmdyT3B0aW9uczoge1xyXG4gICAgICAgIGljb246IHRydWUsXHJcbiAgICAgICAgcmVmOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgICAvLyBDb21wcmVzc2lvbiAtIEJyb3RsaSBhbmQgR3ppcFxyXG4gICAgdml0ZUNvbXByZXNzaW9uKHsgYWxnb3JpdGhtOiBcImJyb3RsaUNvbXByZXNzXCIgfSksXHJcbiAgICB2aXRlQ29tcHJlc3Npb24oeyBhbGdvcml0aG06IFwiZ3ppcFwiIH0pLFxyXG4gICAgLy8gUFdBIENvbmZpZ3VyYXRpb25cclxuICAgIFZpdGVQV0Eoe1xyXG4gICAgICByZWdpc3RlclR5cGU6IFwiYXV0b1VwZGF0ZVwiLFxyXG4gICAgICBpbmNsdWRlQXNzZXRzOiBbXCJmYXZpY29uLmljb1wiLCBcImFwcGxlLXRvdWNoLWljb24ucG5nXCIsIFwibWFzay1pY29uLnN2Z1wiXSxcclxuICAgICAgbWFuaWZlc3Q6IHtcclxuICAgICAgICBuYW1lOiBcIlZpdGUgUFdBIFByb2plY3RcIixcclxuICAgICAgICBzaG9ydF9uYW1lOiBcIlZpdGUgUFdBXCIsXHJcbiAgICAgICAgdGhlbWVfY29sb3I6IFwiI2ZmZmZmZlwiLFxyXG4gICAgICAgIGljb25zOiBbXHJcbiAgICAgICAgICB7IHNyYzogXCJwd2EtNjR4NjQucG5nXCIsIHNpemVzOiBcIjY0eDY0XCIsIHR5cGU6IFwiaW1hZ2UvcG5nXCIgfSxcclxuICAgICAgICAgIHsgc3JjOiBcInB3YS0xOTJ4MTkyLnBuZ1wiLCBzaXplczogXCIxOTJ4MTkyXCIsIHR5cGU6IFwiaW1hZ2UvcG5nXCIgfSxcclxuICAgICAgICAgIHsgc3JjOiBcInB3YS01MTJ4NTEyLnBuZ1wiLCBzaXplczogXCI1MTJ4NTEyXCIsIHR5cGU6IFwiaW1hZ2UvcG5nXCIsIHB1cnBvc2U6IFwiYW55XCIgfSxcclxuICAgICAgICAgIHsgc3JjOiBcIm1hc2thYmxlLWljb24tNTEyeDUxMi5wbmdcIiwgc2l6ZXM6IFwiNTEyeDUxMlwiLCB0eXBlOiBcImltYWdlL3BuZ1wiLCBwdXJwb3NlOiBcIm1hc2thYmxlXCIgfSxcclxuICAgICAgICBdLFxyXG4gICAgICB9LFxyXG4gICAgICB3b3JrYm94OiB7XHJcbiAgICAgICAgbWF4aW11bUZpbGVTaXplVG9DYWNoZUluQnl0ZXM6IDUgKiAxMDI0ICogMTAyNCxcclxuICAgICAgICBydW50aW1lQ2FjaGluZzogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAvLipcXC4oPzpwbmd8anBnfGpwZWd8c3ZnfGdpZnxwZGYpJC8sXHJcbiAgICAgICAgICAgIGhhbmRsZXI6IFwiQ2FjaGVGaXJzdFwiLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiBcImxhcmdlLWFzc2V0c1wiLFxyXG4gICAgICAgICAgICAgIGV4cGlyYXRpb246IHtcclxuICAgICAgICAgICAgICAgIG1heEVudHJpZXM6IDEwLFxyXG4gICAgICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogNyAqIDI0ICogNjAgKiA2MCxcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdXJsUGF0dGVybjogLy4qXFwuKD86anN8Y3NzKS8sXHJcbiAgICAgICAgICAgIGhhbmRsZXI6IFwiTmV0d29ya0ZpcnN0XCIsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICBjYWNoZU5hbWU6IFwic3RhdGljLXJlc291cmNlc1wiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICBdLFxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgICAvLyBDcml0aWNhbCBDU1MgKHVzZWQgd2l0aCBTU1Igb3IgcHJlLXJlbmRlcmVkIEhUTUwpXHJcbiAgICBjcml0aWNhbCh7XHJcbiAgICAgIGNyaXRpY2FsVXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAyOFwiLCAvLyBvcHRpb25hbDogdXNlIHlvdXIgYmFzZSBVUkwgb3IgZW50cnkgSFRNTFxyXG4gICAgICBjcml0aWNhbEJhc2U6IFwiZGlzdC9cIixcclxuICAgICAgY3JpdGljYWxQYWdlczogW3sgdXJpOiBcIlwiLCB0ZW1wbGF0ZTogXCJpbmRleFwiIH1dLFxyXG4gICAgICBjcml0aWNhbDoge1xyXG4gICAgICAgIGlubGluZTogdHJ1ZSxcclxuICAgICAgICBkaW1lbnNpb25zOiBbXHJcbiAgICAgICAgICB7IHdpZHRoOiAzNzUsIGhlaWdodDogNjY3IH0sXHJcbiAgICAgICAgICB7IHdpZHRoOiAxMjgwLCBoZWlnaHQ6IDcyMCB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgZXh0cmFjdDogZmFsc2UsXHJcbiAgICAgICAgbWluaWZ5OiB0cnVlLFxyXG4gICAgICAgIHBlbnRob3VzZToge1xyXG4gICAgICAgICAgdGltZW91dDogNjAwMDAsXHJcbiAgICAgICAgICBmb3JjZUluY2x1ZGU6IFtcclxuICAgICAgICAgICAgXCIudy1mdWxsXCIsXHJcbiAgICAgICAgICAgIFwiLmgtXFxcXFszMDBweFxcXFxdXCIsXHJcbiAgICAgICAgICAgIFwiLm1kXFxcXDpoLVxcXFxbNjAwcHhcXFxcXVwiLFxyXG4gICAgICAgICAgICBcIi5vYmplY3QtY292ZXJcIixcclxuICAgICAgICAgICAgXCIucmVsYXRpdmVcIixcclxuICAgICAgICAgICAgXCIuYWJzb2x1dGVcIixcclxuICAgICAgICAgICAgXCIudHJhbnNpdGlvbi1vcGFjaXR5XCIsXHJcbiAgICAgICAgICAgIFwiLm9wYWNpdHktMTAwXCIsXHJcbiAgICAgICAgICAgIFwiLm9wYWNpdHktMFwiLFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgICAvLyBUYWlsd2luZCBQdXJnZUNTUyBQbHVnaW4gKFVwZGF0ZWQpXHJcbiAgICBwdXJnZUNzcyh7XHJcbiAgICAgIGNvbnRlbnQ6IFtcIi4vaW5kZXguaHRtbFwiLCBcIi4vc3JjLyoqLyoue2pzLGpzeCx0cyx0c3h9XCJdLFxyXG4gICAgICBzYWZlbGlzdDogW1wiaHRtbFwiLCBcImJvZHlcIiwgL15oLS8sIC9ebWQ6LywgL15vcGFjaXR5LS8sIC9edHJhbnNpdGlvbi0vLCBcIm9iamVjdC1jb3ZlclwiLCBcImFic29sdXRlXCIsIFwicmVsYXRpdmVcIl0sXHJcbiAgICAgIC8vIEFkZCBkZWJ1Z2dpbmcgb3IgdmVyYm9zZSBvdXRwdXRcclxuICAgICAgdmVyYm9zZTogdHJ1ZSwgLy8gQ2hlY2sgcGx1Z2luIGRvY3VtZW50YXRpb24gZm9yIGV4YWN0IG9wdGlvblxyXG4gICAgfSksXHJcbiAgICAvLyBSb2xsdXAgVmlzdWFsaXplciBQbHVnaW5cclxuICAgIHZpc3VhbGl6ZXIoe1xyXG4gICAgICBmaWxlbmFtZTogXCJkaXN0L3N0YXRzLmh0bWxcIixcclxuICAgICAgb3BlbjogdHJ1ZSxcclxuICAgIH0pLFxyXG4gICAgZGVmZXJOb25Dcml0aWNhbENTUygpLFxyXG4gICAgLy8gQXBwZW5kIGJ1aWxkIHRpbWVzdGFtcFxyXG4gICAge1xyXG4gICAgICBuYW1lOiBcImFwcGVuZC1idWlsZC10aW1lc3RhbXBcIixcclxuICAgICAgY29uZmlnOiAoKSA9PiAoe1xyXG4gICAgICAgIGJ1aWxkOiB7XHJcbiAgICAgICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiBgYXNzZXRzL1tuYW1lXS1baGFzaF0tJHt0aW1lc3RhbXB9LmpzYCxcclxuICAgICAgICAgICAgICBjaHVua0ZpbGVOYW1lczogYGFzc2V0cy9bbmFtZV0tW2hhc2hdLSR7dGltZXN0YW1wfS5qc2AsXHJcbiAgICAgICAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhc3NldEluZm8ubmFtZSAmJiBhc3NldEluZm8ubmFtZS5lbmRzV2l0aCgnLmNzcycpKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBgYXNzZXRzL21haW4tRGR3Y3d0WjgtMTc0NDYwMjY2MzE4OC5jc3NgOyAvLyBGb3JjZSBzaW5nbGUgQ1NTIGZpbGUgbmFtZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGBhc3NldHMvW25hbWVdLVtoYXNoXS0ke3RpbWVzdGFtcH1bZXh0bmFtZV1gO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pLFxyXG4gICAgfSxcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsIC8vIEVuc3VyZSBhbGwgQ1NTIGlzIGJ1bmRsZWQgaW50byBvbmUgZmlsZVxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBtYW51YWxDaHVua3M6ICgpID0+IG51bGwsIC8vIERpc2FibGUgYWxsIGNodW5rIHNwbGl0dGluZ1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgaGlzdG9yeUFwaUZhbGxiYWNrOiB0cnVlLFxyXG4gICAgcG9ydDogMzAwMSxcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgXCJTZXJ2aWNlLVdvcmtlci1BbGxvd2VkXCI6IFwiL1wiLFxyXG4gICAgfSxcclxuICAgIHByb3h5OiB7XHJcbiAgICAgIFwiL2FwaVwiOiB7XHJcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAyMVwiLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogZmFsc2UsXHJcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBiYXNlOiBcIi9cIixcclxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUFtVixTQUFTLG9CQUFvQjtBQUNoWCxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sVUFBVTtBQUNqQixPQUFPLHFCQUFxQjtBQUM1QixPQUFPLFVBQVU7QUFDakIsU0FBUyxrQkFBa0I7QUFDM0IsT0FBTyxjQUFjO0FBQ3JCLFNBQVMsZ0JBQWdCO0FBQ3pCLE9BQU8sMkJBQTJCO0FBVGxDLElBQU0sbUNBQW1DO0FBV3pDLElBQU0sc0JBQXNCLE9BQU87QUFBQSxFQUNqQyxNQUFNO0FBQUEsRUFDTixtQkFBbUIsTUFBTSxFQUFFLE9BQU8sR0FBRztBQUNuQyxZQUFRLElBQUksV0FBVyxNQUFNO0FBQzdCLFFBQUksQ0FBQyxRQUFRO0FBQ1gsYUFBTztBQUFBLElBQ1Q7QUFDQSxVQUFNLFVBQVUsT0FBTyxLQUFLLE1BQU0sRUFBRSxLQUFLLENBQUMsU0FBUyxLQUFLLFNBQVMsTUFBTSxDQUFDO0FBQ3hFLFFBQUksU0FBUztBQUNYLGFBQU8sS0FBSztBQUFBLFFBQ1Y7QUFBQSxRQUNBLGlDQUFpQyxPQUFPO0FBQUEsTUFDMUM7QUFBQSxJQUNGO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFDRjtBQUVBLElBQU0sWUFBWSxLQUFLLElBQUk7QUFDM0IsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sc0JBQXNCO0FBQUE7QUFBQSxJQUV0QixLQUFLO0FBQUEsTUFDSCxhQUFhO0FBQUEsUUFDWCxNQUFNO0FBQUEsUUFDTixLQUFLO0FBQUEsTUFDUDtBQUFBLElBQ0YsQ0FBQztBQUFBO0FBQUEsSUFFRCxnQkFBZ0IsRUFBRSxXQUFXLGlCQUFpQixDQUFDO0FBQUEsSUFDL0MsZ0JBQWdCLEVBQUUsV0FBVyxPQUFPLENBQUM7QUFBQTtBQUFBLElBRXJDLFFBQVE7QUFBQSxNQUNOLGNBQWM7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
