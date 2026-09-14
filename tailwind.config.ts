import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          bg: "#F7F5F2",
          surface: "#FFFFFF",
          charcoal: "#30363D",
          "charcoal-dark": "#20252A",
          gold: "#C78D4E",
          "gold-light": "#D8A66C",
          muted: "#6D7277",
          border: "#E8E3DD",
        },
        navy: {
          50: "#f0f4f9",
          100: "#e0eaf3",
          200: "#c2d6e8",
          300: "#94b9d8",
          400: "#5f95c3",
          500: "#3b76ad",
          600: "#2b5d8f",
          700: "#234a73",
          800: "#1e3e5f",
          900: "#0f2744",
          950: "#081627",
        },
        gold: {
          50: "#fcf9ee",
          100: "#f8f1d5",
          200: "#f1e1aa",
          300: "#e7cd74",
          400: "#deb442",
          500: "#d49b25",
          600: "#b97b1b",
          700: "#925918",
          800: "#79461a",
          900: "#653a1a",
          950: "#3b1e0b",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
