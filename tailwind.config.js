/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'card-border': 'rgba(34, 197, 94, 0.3)',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
      transitionProperty: {
        'size': 'width, height',
      }
    },
  },
  plugins: [],
};
