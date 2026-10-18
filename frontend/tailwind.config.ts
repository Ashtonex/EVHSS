import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
        nunito: ["var(--font-nunito)", "sans-serif"],
        heading: ["var(--font-heading)", "var(--font-inter)", "sans-serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Direct Semantic Theme Tokens
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        // Dedicated Brand Palettes (Constitution §4.1)
        vet: {
          DEFAULT: "hsl(214, 100%, 30%)",
          light: "hsl(214, 75%, 45%)",
          dark: "hsl(214, 100%, 20%)",
          subtle: "hsl(214, 30%, 92%)",
        },
        amberBrand: {
          DEFAULT: "hsl(24, 95%, 42%)",
          light: "hsl(24, 95%, 53%)",
          dark: "hsl(24, 95%, 32%)",
          peach: "hsl(24, 100%, 94%)",
        },
        tealBrand: {
          DEFAULT: "hsl(172, 58%, 39%)",
          light: "hsl(172, 58%, 50%)",
        },
        // Compatibility Aliases for Existing Components
        evhs: {
          DEFAULT: "hsl(214, 100%, 30%)",
          light: "hsl(214, 75%, 45%)",
          dark: "hsl(214, 100%, 20%)",
        },
        shampooch: {
          DEFAULT: "hsl(24, 95%, 42%)",
          light: "hsl(24, 95%, 53%)",
          dark: "hsl(24, 95%, 32%)",
        },
        gold: {
          DEFAULT: "hsl(44, 70%, 45%)",
          light: "hsl(44, 80%, 60%)",
        },
        ivory: {
          DEFAULT: "#ffffff",
          dark: "#f4f4f5",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
