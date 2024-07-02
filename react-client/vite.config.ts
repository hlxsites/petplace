import react from "@vitejs/plugin-react-swc";
import path from "path";
import svgr from "vite-plugin-svgr";

import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/account/",
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/react-[name]-[hash].js",
        chunkFileNames: "assets/react-[name]-[hash].js",
        assetFileNames: "assets/react.[ext]",
      },
    },
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        replaceAttrValues: {
          white: "currentColor",
        },
      },
      include: "**/*.svg",
    }),
  ],
  resolve: {
    alias: [{ find: "~", replacement: path.resolve(__dirname, "src") }],
  },
});
