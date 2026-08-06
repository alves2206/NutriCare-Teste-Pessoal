import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        rosepetal: {
          50: "#fff7f7",
          100: "#ffe8ec",
          200: "#ffd0d9",
          300: "#f7aabd",
          400: "#e77d9b",
          500: "#c95d7e"
        },
        mauve: {
          50: "#faf7fb",
          100: "#f1e7f4",
          300: "#d9bde2",
          500: "#9466a3"
        },
        sage: {
          100: "#e8f2ec",
          500: "#6f9b80"
        },
        ink: "#322a31"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(80, 53, 71, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
