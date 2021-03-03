module.exports = {
  purge: ['./pages/**/*.tsx', './components/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'lavender-purple': {
          300: '#584f8d',
          500: '#8f5881',
          900: '#36324a',
        },
        'opacity-white': {
          80: 'hsla(0,0%,100%,.8)',
        },
      },
      zIndex: {
        9999: '9999',
        10000: '1000',
      },
      minHeight: {
        12: '3rem',
      },
      maxWidth: {
        1100: '1100px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
