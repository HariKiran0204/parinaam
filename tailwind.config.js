/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          hover: 'var(--primary-hover)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        fest: {
          purple: '#c084fc',
          deepViolet: '#6b21a8',
          electricPurple: '#d946ef',
          neonCyan: '#06b6d4',
          gold: '#f59e0b',
          darkBg: '#05030a',
          cardBg: '#0b0716',
        }
      },
      fontFamily: {
        sans: ['Oswald', 'var(--font-gothic)', 'system-ui', 'sans-serif'],
        gothic: ['Oswald', 'var(--font-gothic)', 'sans-serif'],
        display: ['var(--font-pixel)', 'var(--font-display)', 'monospace', 'sans-serif'],
        pixel: ['var(--font-pixel)', 'Silkscreen', 'monospace'],
        devanagari: ['var(--font-devanagari)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'elevated': '0 12px 30px rgba(0, 0, 0, 0.12)',
        'fest-brand': '0 8px 30px rgba(217, 70, 239, 0.4)',
        'purple-glow': '0 0 25px rgba(217, 70, 239, 0.5)',
      },
      borderRadius: {
        'fest': '0.625rem',
      }
    },
  },
  plugins: [],
};
