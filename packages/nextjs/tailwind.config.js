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
          primary: "#A7C7E7",
          "primary-content": "#2A303C",
          secondary: "#F8C8DC",
          "secondary-content": "#2A303C",
          accent: "#C3B1E1",
          "accent-content": "#2A303C",
          neutral: "#2A303C",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#F7F9FC",
          "base-300": "#E8F0FF",
          "base-content": "#2A303C",
          info: "#A7C7E7",
          success: "#B4E6B0",
          warning: "#FFE5B4",
          error: "#FFB3B3",

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
          primary: "#8EB3D9",
          "primary-content": "#F9FBFF",
          secondary: "#E0B0C7",
          "secondary-content": "#F9FBFF",
          accent: "#A593C3",
          "accent-content": "#F9FBFF",
          neutral: "#F9FBFF",
          "neutral-content": "#4A5568",
          "base-100": "#4A5568",
          "base-200": "#374151",
          "base-300": "#2A303C",
          "base-content": "#F9FBFF",
          info: "#8EB3D9",
          success: "#9ED49A",
          warning: "#E6CCA0",
          error: "#E69F9F",

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
