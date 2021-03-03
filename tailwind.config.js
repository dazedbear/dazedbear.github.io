module.exports = {
  purge: ['./pages/**/*.tsx', './components/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundPosition: {
        '50%': '50%',
      },
      colors: {
        'lavender-purple': {
          300: '#584f8d',
          500: '#8f5881',
          900: '#36324a',
        },
        'opacity-white': {
          75: 'hsla(0, 0%, 100%, 0.75)',
          80: 'hsla(0,0%,100%,.8)',
        },
      },
      flex: {
        '1-0-26': '1 0 26%',
      },
      fontSize: {
        '4.5xl': '2.5rem',
      },
      lineHeight: {
        '4.5xl': '2.75rem',
      },
      zIndex: {
        9999: '9999',
        10000: '1000',
      },
      minHeight: {
        12: '3rem',
        800: '800px',
        100: '100px',
        150: '150px',
      },
      maxWidth: {
        80: '80px',
        150: '150px',
        730: '730px',
        900: '900px',
        1100: '1100px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
