/** @type {import('tailwindcss').Config} */

const SPACING_DEFAULTS = {
  0: "0",
  auto: "auto",
  xxxxxlarge: "var(--xxxxxlarge)",
  xxxxlarge: "var(--xxxxlarge)",
  xxxlarge: "var(--xxxlarge)",
  xxlarge: "var(--xxlarge)",
  xlarge: "var(--xlarge)",
  large: "var(--large)",
  base: "var(--base)",
  medium: "var(--medium)",
  small: "var(--small)",
  xsmall: "var(--xsmall)",
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  mode: "jit",
  plugins: [],
  safelist: ["aria-selected:true", "aria-selected:false"],

  theme: {
    boxShadow: {
      "elevation-1": "0px 2px 4px 0px rgba(0, 0, 0, 0.24)",
    },
    colors: {
      "brand-secondary": "var(--orange-300-contrast)",
      "brand-blue": "var(--brand-blue)",
      "brand-main": "var(--color-purple)",
      "purple-500": "var(--purple-500)",
      "purple-300": "var(--purple-300)",
      "purple-100": "var(--purple-100)",
      "orange-500": "var(--orange-500)",
      "orange-300-contrast": "var(--orange-300-contrast)",
      "orange-300-main": "var(--orange-300-main)",
      "orange-100": "var(--orange-100)",
      "blue-500": "var(--blue-500)",
      "blue-300": "var(--blue-300)",
      "blue-100": "var(--blue-100)",
      "maroon-500": "var(--maroon-500)",
      "maroon-300": "var(--maroon-300)",
      "maroon-100": "var(--maroon-100)",
      "green-500": "var(--green-500)",
      "success-contrast": "var(--green-500)",
      "success-background": "var(--green-100)",
      "green-300": "var(--green-300)",
      "green-100": "var(--green-100)",
      "yellow-500": "var(--yellow-500)",
      "yellow-300": "var(--yellow-300)",
      "yellow-100": "var(--yellow-100)",
      "red-500": "var(--red-500)",
      "red-300": "var(--red-300)",
      "red-100": "var(--red-100)",
      "error-contrast": "var(--red-500)",
      "error-background": "var(--red-100)",
      "neutral-950": "var(--neutral-950)",
      "neutral-900": "var(--neutral-900)",
      "neutral-800": "var(--neutral-800)",
      "neutral-700": "var(--neutral-700)",
      "neutral-600": "var(--neutral-600)",
      "neutral-500": "var(--neutral-500)",
      "neutral-400": "var(--neutral-400)",
      "neutral-300": "var(--neutral-300)",
      "neutral-200": "var(--neutral-200)",
      "neutral-100": "var(--neutral-100)",
      "neutral-50": "var(--neutral-50)",
      "neutral-white": "var(--neutral-white)",
      "background-disabled": "var(--background-disabled)",
      "border-secondary": "var(--border-secondary)",
      "text-danger-default": "var(--text-danger-default)",
      "text-disabled": "var(--text-color-disabled)",
      "text-hinted": "var(--text-hinted)",
      "text-color": "var(--text-color)",
      "icon-danger": "var(--icon-danger)",
      "background-color-tertiary": "var(--background-color-tertiary)",
      white: "#ffffff",
      black: "#000000",
      transparent: "transparent",
    },
    fontFamily: {
      franklin: "var(--body-font-family)",
      raleway: "var(--heading-font-family)",
      roboto: "var(--fixed-font-family)",
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "2rem",
    },
    gap: SPACING_DEFAULTS,
    margin: SPACING_DEFAULTS,
    padding: SPACING_DEFAULTS,
    space: SPACING_DEFAULTS,
    translate: SPACING_DEFAULTS,
    extend: {
      height: SPACING_DEFAULTS,
      width: SPACING_DEFAULTS,
    },
    extend: {
      maxHeight: {
        "90vh": "90vh",
        "80vh": "80vh",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideInFromBottom: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideOutToBottom: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
        slideInFromRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOutToRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 300ms ease-in-out",
        fadeOut: "fadeOut 300ms ease-in-out",
        slideInFromBottom: "slideInFromBottom 300ms forwards",
        slideOutToBottom: "slideOutToBottom 300ms forwards",
        slideInFromRight: "slideInFromRight 300ms forwards",
        slideOutToRight: "slideOutToRight 300ms forwards",
      },
    },
  },
};
