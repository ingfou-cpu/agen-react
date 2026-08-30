/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        copper: {
          DEFAULT: 'rgb(var(--c-copper) / <alpha-value>)',
          light: 'rgb(var(--c-copper-light) / <alpha-value>)',
          dark: 'rgb(var(--c-copper-dark) / <alpha-value>)',
        },
        forest: {
          DEFAULT: 'rgb(var(--c-forest) / <alpha-value>)',
          dark: 'rgb(var(--c-forest-dark) / <alpha-value>)',
          darker: 'rgb(var(--c-forest-darker) / <alpha-value>)',
          light: 'rgb(var(--c-forest-light) / <alpha-value>)',
        },
        sand: {
          DEFAULT: 'rgb(var(--c-sand) / <alpha-value>)',
          light: 'rgb(var(--c-sand-light) / <alpha-value>)',
          dark: 'rgb(var(--c-sand-dark) / <alpha-value>)',
        },
        gold: 'rgb(var(--c-gold) / <alpha-value>)',
        cream: 'rgb(var(--c-cream) / <alpha-value>)',
        terracotta: {
          DEFAULT: 'rgb(var(--c-accent) / <alpha-value>)',
          light: 'rgb(var(--c-accent-light) / <alpha-value>)',
          dark: 'rgb(var(--c-accent-dark) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        arabic: ['Amiri', '"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        soft: '0 20px 60px -20px rgb(var(--c-forest-darker) / 0.35)',
        'soft-lg': '0 40px 80px -24px rgb(var(--c-forest-darker) / 0.4)',
        card: '0 10px 40px -12px rgb(var(--c-forest-darker) / 0.25)',
        glow: '0 10px 40px -8px rgb(var(--c-copper) / 0.5)',
      },
      backgroundImage: {
        'copper-gradient':
          'linear-gradient(135deg, rgb(var(--c-copper-light)) 0%, rgb(var(--c-copper)) 50%, rgb(var(--c-copper-dark)) 100%)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
