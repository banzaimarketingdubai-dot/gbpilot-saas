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
        google: {
          blue: '#1A73E8',
          'blue-hover': '#174EA6',
          'blue-light': '#E8F0FE',
          green: '#1E8E3E',
          'green-light': '#E6F4EA',
          yellow: '#F9AB00',
          'yellow-light': '#FEF7E0',
          red: '#D93025',
          'red-light': '#FCE8E6',
          bg: '#F8F9FA',
          surface: '#FFFFFF',
          border: '#DADCE0',
          'border-light': '#E8EAED',
          'text-primary': '#202124',
          'text-secondary': '#5F6368',
          'text-tertiary': '#80868B',
        },
      },
      fontFamily: {
        sans: ['Google Sans', 'Roboto', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'material-1': '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
        'material-2': '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
        'material-3': '0 4px 8px 3px rgba(60,64,67,0.15), 0 8px 12px 6px rgba(60,64,67,0.15)',
        'material-hover': '0 2px 6px 2px rgba(60,64,67,0.15), 0 1px 2px 0 rgba(60,64,67,0.3)',
      },
      keyframes: {
        dash: {
          '0%': { strokeDasharray: '0, 100' },
        }
      },
      animation: {
        dash: 'dash 1.5s ease-out forwards',
      }
    },
  },
  plugins: [],
};
