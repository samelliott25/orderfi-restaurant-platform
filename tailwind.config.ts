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
        // Urbanist Design System Colors
        'urbanist': {
          'green': {
            DEFAULT: '#4CAF50',
            light: '#81C784',
            dark: '#388E3C',
            bg: '#F1F8E9',
          },
          'yellow': {
            DEFAULT: '#FFC107',
            light: '#FFD54F',
            dark: '#F57C00',
            bg: '#FFFDE7',
          },
          'black': '#1C1C1E',
          'gray': {
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#E0E0E0',
            300: '#D0D0D0',
            500: '#9E9E9E',
            700: '#424242',
            900: '#212121',
          },
        },
        // Urbanist Gradient definitions
        'gradient': {
          'primary': 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
          'secondary': 'linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)',
          'accent': 'linear-gradient(135deg, #4CAF50 0%, #FFC107 100%)',
          'background': 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)',
          'card': 'radial-gradient(circle at top right, #FFFFFF 0%, #F1F8E9 100%)',
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
