/** @type {import('tailwindcss').Config} */
import { CUSTOM_THEME } from "./tailwind.theme";

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  mode: "jit",
  plugins: [],
  safelist: [
    "aria-selected:true",
    "aria-selected:false",
    {
      pattern: /bg-+/,
    },
    {
      pattern: /text-+/,
    },
  ],

  theme: CUSTOM_THEME,
};
