import react from "@vitejs/plugin-react-swc";
import path from "path";
import svgr from "vite-plugin-svgr";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const isProdEnv = env.NODE_ENV === "production";
  const isTestEnv = env.NODE_ENV === "test";

  return {
    base: "/account/",
    build: {
      rollupOptions: {
        output: {
          entryFileNames: "assets/react-[name].js",
          chunkFileNames: "assets/react-[name].js",
          assetFileNames: "assets/react.[ext]",
        },
      },
    },
    define: {
      "process.env": {
        isProdEnv,
        isTestEnv,
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
      alias: [
        { find: "~", replacement: path.resolve(__dirname, "src") },
        {
          find: "@images",
          replacement: path.resolve(__dirname, "src/assets/images"),
        },
      ],
    },
  };
});
