/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        dark: {
          base: '#090D16',
          surface: '#111827',
          elevated: '#1F293D',
          card: 'rgba(22, 31, 48, 0.72)',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        light: {
          base: '#F8FAFC',
          surface: '#FFFFFF',
          elevated: '#F1F5F9',
          card: '#FFFFFF',
          border: 'rgba(15, 23, 42, 0.08)',
          text: '#0F172A',
          muted: '#475569',
        }
      },
      fontFamily: {
        main: ['Outfit', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '20px',
      },
      boxShadow: {
        glow: '0 0 30px rgba(99, 102, 241, 0.25)',
        cyan: '0 0 30px rgba(6, 182, 212, 0.25)',
        card: '0 8px 24px -4px rgba(0, 0, 0, 0.35)',
        lightCard: '0 4px 20px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
