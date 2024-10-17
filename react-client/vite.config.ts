import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/react-[name].min.js",
        chunkFileNames: "assets/react-[name].min.js",
        assetFileNames: ({ name }) => {
          // Special handling for images
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? "")) {
            return "react/react-[name][extname]";
          }

          if (/\.css$/.test(name ?? "")) {
            return "assets/react.css";
          }

          return "assets/react-[name][extname]";
        },
      },
    },
    // Enable sourcemaps to help with debugging
    // It will be uploaded to Rollbar
    sourcemap: true,
  },
  plugins: [
    // @ts-expect-error - don't have a clue why this is not working
    react(),
    // @ts-expect-error - don't have a clue why this is not working
    svgr({
      svgrOptions: {
        replaceAttrValues: {
          white: "currentColor",
        },
      },
      include: "**/*.svg",
    }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: [{ find: "~", replacement: path.resolve(__dirname, "src") }],
  },
});
