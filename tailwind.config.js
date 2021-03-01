module.exports = {
  purge: ['./pages/**/*.tsx', './components/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'lavender-purple': {
          300: '#584f8d',
          900: '#36324a',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
