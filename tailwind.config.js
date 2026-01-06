/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark': {
          'navy': '#1a1625',
          'purple': '#2d1b3d',
          'purple-light': '#3d2b4d',
          'gold': '#f4a261',
          'red': '#e63946',
          'red-light': '#ff6b6b',
          'white': '#ffffff',
          'gray': '#a8a8b3',
          'gray-dark': '#6b6b7a',
        },
        // Keep old colors for backward compatibility during transition
        'wellness': {
          'cream': '#FAF9F6',
          'cream-gradient': '#F5F3EF',
          'teal': '#7A9A8C',
          'teal-light': '#8FB8AC',
          'teal-hover': '#6B9080',
          'coral': '#E07A5F',
          'charcoal': '#1F2622',
          'charcoal-light': '#2C3531',
          'gray': '#7D8A96',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Inter', 'SF Pro Display', 'sans-serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
      },
      lineHeight: {
        relaxed: '1.6',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'scale-up': 'scaleUp 0.2s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'breathe': 'breathe 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.01)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(244, 162, 97, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(244, 162, 97, 0.6)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

