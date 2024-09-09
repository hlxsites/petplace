/** @type {import('tailwindcss').Config} */
import { CUSTOM_THEME } from "./tailwind.theme";

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  mode: "jit",
  plugins: [],
  safelist: [
    "aria-selected:true",
    "aria-selected:false",
    {
      pattern: /text-+/,
    },
  ],

  theme: CUSTOM_THEME,
};
