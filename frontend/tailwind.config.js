/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'surface':                   '#f8f9ff',
        'surface-high':              '#dce9ff',
        'surface-container':         '#e5eeff',
        'surface-low':               '#eff4ff',
        'surface-dim':               '#cbdbf5',
        'surface-tint':              '#585c7d',
        'on-surface':                '#0b1c30',
        'on-surface-variant':        '#46464d',
        'primary-container':         '#141936',
        'on-primary-container':      '#7d82a5',
        'secondary':                 '#b7102a',
        'outline':                   '#77767e',
        'outline-variant':           '#c7c5ce',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      maxWidth: { app: '1400px' },
      screens: {
        'xs':  '480px',
        'sm':  '640px',
        'md':  '768px',
        'lg':  '1024px',
        'xl':  '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      boxShadow: {
        card:  '0 8px 30px rgba(0,0,0,0.07)',
        nav:   '0 1px 4px rgba(0,0,0,0.06)',
        float: '0 8px 32px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}
