/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // BD real brand colors: navy primary, orange accent.
        navy: {
          50: '#eef2f8',
          100: '#dce5f1',
          200: '#b3c5e0',
          300: '#8aa5cf',
          400: '#4c73ad',
          500: '#194890',
          600: '#163f7f',
          700: '#123467',
          800: '#0e2950',
          900: '#0a1e3a',
          950: '#061327',
        },
        orange: {
          50: '#fef3ea',
          100: '#fde3cc',
          200: '#fac59a',
          300: '#f7a768',
          400: '#f38f45',
          500: '#f07822',
          600: '#d3611a',
          700: '#a64b15',
          800: '#7a3710',
          900: '#4d230a',
        },
        slate: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d7dbe3',
          300: '#b7bec9',
          400: '#8b95a5',
          500: '#657286',
          600: '#4d586b',
          700: '#3a4456',
          800: '#262e3d',
          900: '#171d28',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
