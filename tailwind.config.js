module.exports = {
  purge: ['./src/pages/**/*.tsx', './src/components/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  important: '#app',
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
      height: {
        '0.5': '0.125rem',
        '0.75': '0.1875rem',
      },
      lineHeight: {
        '4.5xl': '2.75rem',
      },
      zIndex: {
        1000: '1000',
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
