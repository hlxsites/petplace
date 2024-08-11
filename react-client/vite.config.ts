import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: env.BASE_URL || "/",
    build: {
      rollupOptions: {
        output: {
          entryFileNames: "assets/react-[name].js",
          chunkFileNames: "assets/react-[name].js",
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
  };
});
