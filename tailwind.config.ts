import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'brand': ['Comfortaa', 'cursive'],
        'heading': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'ui': ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Kleurvorm™ palette colors from uploaded swatch
        'kleurvorm': {
          'black': '#1e1e2a',      // Structure/stability
          'blue': '#2233ff',       // Primary blue
          'purple': '#8d5fff',     // Purple accent
          'pink': '#f53855',       // Pink accent
          'light-blue': '#cad7ff', // Light blue
          'white': '#ffffff',      // Pure white
          'orange': '#ff7e5f',     // Orange pop
          'red': '#f53855',        // Red pop
          'pop-white': '#ffffff',  // Pop white
          'pop-pink': '#ffc0cb',   // Pop pink
          'pop-purple': '#800080', // Pop purple
          'pop-orange': '#ffa500', // Pop orange
        },
        // Gradient definitions
        'gradient': {
          'primary': 'linear-gradient(135deg, #2233ff 0%, #8d5fff 100%)',
          'secondary': 'linear-gradient(135deg, #8d5fff 0%, #f53855 100%)',
          'accent': 'linear-gradient(135deg, #ff7e5f 0%, #f53855 100%)',
          'background': 'linear-gradient(135deg, #cad7ff 0%, #ffffff 100%)',
          'card': 'radial-gradient(circle at top right, #ffffff 0%, #ffc0cb 100%)',
        },
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
