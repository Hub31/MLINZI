import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mlinzi: {
          primary: '#00A86B',      // Kenyan green
          secondary: '#1a1a2e',    // Dark navy
          accent: '#FF4444',       // Emergency red
          gold: '#FFD700',         // Premium gold
          sky: '#87CEEB',          // Calm sky
          dark: '#0a0a0f',         // Deep black
          light: '#f0f0f5',        // Off-white
          warning: '#FFCC44',      // Yellow alert
        },
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-sos': 'pulse-sos 1.5s ease-in-out infinite',
        'shield-pulse': 'shield-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-sos': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        'shield-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 168, 107, 0.4)' },
          '50%': { boxShadow: '0 0 0 20px rgba(0, 168, 107, 0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
