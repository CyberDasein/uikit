import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  root: "src",
  server: {
    host: true, // слушать и IPv4, и IPv6 — доступен localhost и локальная сеть
    port: 8080,
    strictPort: false,
    open: true,
  },
  plugins: [
    ViteImageOptimizer({
      // конвертация растровых картинок в WebP
      test: /\.(jpe?g|png|gif|tiff|webp|svg)$/i,
      includePublic: true,
      logStats: true,
      png: { quality: 80 },
      jpeg: { quality: 80 },
      webp: { quality: 80 },
      // gif и svg остаются без изменений (gif нельзя конвертировать в webp)
      gif: {},
      svg: {},
    }),
  ],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "src/index.html"),
      output: {
        entryFileNames: "js/[name].js",
        chunkFileNames: "js/[name].js",
        assetFileNames: (assetInfo) => {
          if (/\.css$/.test(assetInfo.names?.[0] ?? assetInfo.name))
            return "css/[name][extname]";
          if (
            /\.(png|jpe?g|svg|gif|webp|ico)$/.test(
              assetInfo.names?.[0] ?? assetInfo.name,
            )
          )
            return "img/[name][extname]";
          return "assets/[name][extname]";
        },
      },
    },
  },
});
