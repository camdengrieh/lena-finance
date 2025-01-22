/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        light: {
          primary: "#E6F0FF", // Light pastel blue
          "primary-content": "#000000", // Black text
          secondary: "#FFE6EA", // Light pastel pink
          "secondary-content": "#000000",
          accent: "#F0E6FF", // Light pastel purple
          "accent-content": "#000000",
          neutral: "#000000",
          "neutral-content": "#FFFFFF",
          "base-100": "#FFFFFF",
          "base-200": "#F5F5F5",
          "base-300": "#EBEBEB",
          "base-content": "#000000",
          info: "#E6F0FF",
          success: "#E6FFE6",
          warning: "#FFF5E6",
          error: "#FFE6E6",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
      {
        dark: {
          primary: "#1A1A1A", // Very dark gray
          "primary-content": "#FFFFFF", // White text
          secondary: "#262626", // Dark gray
          "secondary-content": "#FFFFFF",
          accent: "#333333", // Medium dark gray
          "accent-content": "#FFFFFF",
          neutral: "#FFFFFF",
          "neutral-content": "#000000",
          "base-100": "#000000",
          "base-200": "#0D0D0D",
          "base-300": "#1A1A1A",
          "base-content": "#FFFFFF",
          info: "#1A1A1A",
          success: "#1A1A1A",
          warning: "#1A1A1A",
          error: "#1A1A1A",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--p))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        future: ["Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in-down": "fadeInDown 1s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeInDown: {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },
};
