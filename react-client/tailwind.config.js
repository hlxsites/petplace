/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      "highlight-color": "var(--highlight-color)",
      "primary-color": "var(--cta-button-color)",
      white: "#ffffff",
      black: "#000000",
      transparent: "transparent",
    },
    extend: {},
  },
  plugins: [],
};
