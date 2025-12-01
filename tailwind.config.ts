import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Department of Gambling Color Palette
        primary: {
          DEFAULT: '#0A1F44', // Navy Blue
          dark: '#06152E',
        },
        secondary: {
          DEFAULT: '#4A90E2', // Steel Blue
          light: '#7CB9E8',
        },
        accent: {
          DEFAULT: '#FF0080', // Electric Magenta (Prompt A accent color)
          glow: '#FF33A1',
        },
        success: '#2ECC71',
        loss: '#E74C3C',
        background: '#F8F9FA',
        text: {
          DEFAULT: '#2C3E50',
          muted: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Courier New', 'monospace'],
        geometric: ['var(--font-geometric)', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '24px 24px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-in-left': 'slide-in-left 0.6s ease-out',
        'slide-in-bottom': 'slide-in-bottom 0.6s ease-out',
        'fade-in': 'fade-in 0.8s ease-out',
        'draw-line': 'draw-line 2s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-bottom': {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'draw-line': {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
