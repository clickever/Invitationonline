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
          50: "#FAF7F2",
          100: "#F4EFE6",
          200: "#E8DCBC",
          300: "#DBC793",
          400: "#CDB36A",
          500: "#B8973D",
          600: "#96792E",
          700: "#755D23",
          800: "#55431A",
          900: "#362A10",
        },
        champagne: {
          light: "#FDFBF7",
          DEFAULT: "#F4EFE6",
          gold: "#D4AF37",
          dark: "#AA820A",
        },
        burgundy: {
          light: "#801B2E",
          DEFAULT: "#580A18",
          dark: "#38000A",
        },
        emerald: {
          DEFAULT: "#0F4C3A",
          dark: "#082F24",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "Great Vibes", "cursive"],
        cinzel: ["Cinzel", "serif"],
      },
      boxShadow: {
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.08)",
        floating: "0 20px 40px -15px rgba(0, 0, 0, 0.15)",
        gold: "0 4px 20px -2px rgba(212, 175, 55, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
