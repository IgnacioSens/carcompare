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
        'accent':               '#E30613',
        'accent-blue':          '#00C6FF',
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
        card:        '0 8px 30px rgba(0,0,0,0.07)',
        nav:         '0 1px 4px rgba(0,0,0,0.06)',
        float:       '0 8px 32px rgba(0,0,0,0.10)',
        'glow-red':  '0 0 40px rgba(227,6,19,0.25), 0 0 80px rgba(227,6,19,0.10)',
        'glow-blue': '0 0 40px rgba(0,198,255,0.25), 0 0 80px rgba(0,198,255,0.10)',
        'premium':   '0 25px 80px rgba(0,0,0,0.5)',
        'glass':     '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':      'float 6s ease-in-out infinite',
        'glow':       'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 20px rgba(227,6,19,0.2)' },
          'to':   { boxShadow: '0 0 40px rgba(227,6,19,0.4)' },
        },
      },
    },
  },
  plugins: [],
}
