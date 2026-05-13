/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'surface':              'var(--color-surface)',
        'surface-high':         'var(--color-surface-high)',
        'surface-container':    'var(--color-surface-container)',
        'surface-low':          'var(--color-surface-low)',
        'surface-dim':          'var(--color-surface-dim)',
        'surface-tint':         'var(--color-surface-tint)',
        'on-surface':           'var(--color-on-surface)',
        'on-surface-variant':   'var(--color-on-surface-variant)',
        'primary-container':    'var(--color-primary-container)',
        'on-primary-container': 'var(--color-on-primary-container)',
        'secondary':            'var(--color-secondary)',
        'outline':              'var(--color-outline)',
        'outline-variant':      'var(--color-outline-variant)',
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
