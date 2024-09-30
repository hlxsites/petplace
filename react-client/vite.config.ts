import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, loadEnv } from "vite";
// @ts-expect-error - Vite plugin is not typed
import viteRollbar from "vite-plugin-rollbar";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const version = env.VITE_APP_VERSION;

  const rollbarConfig = {
    accessToken: env.ROLLBAR_SERVER_TOKEN,
    version,
    baseUrl: "www.petplace.com",
    ignoreUploadErrors: true,
    silent: true,
  };

  return {
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      viteRollbar(rollbarConfig),
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
    server: {
      port: 3000,
    },
    resolve: {
      alias: [{ find: "~", replacement: path.resolve(__dirname, "src") }],
    },
  };
});
