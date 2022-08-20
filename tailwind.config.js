module.exports = {
  content: ['./src/pages/**/*.tsx', './src/components/**/*.tsx'],
  important: '#app',
  theme: {
    extend: {
      backgroundPosition: {
        '50%': '50%',
      },
      backgroundImage: (theme) => ({
        'cover-music': "url('/cover-music.jpg')",
        'cover-maintain': "url('/cover-maintain.jpg')",
        'texture-colorful': "url('/texture-colorful.jpg')",
        'gradient-yellow-purple':
          'linear-gradient(90deg, rgba(255,211,71,1) 0%, rgba(217,141,238,1) 100%)',
      }),
      colors: {
        brown: {
          300: '#27210a',
        },
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
        'xs+': '0.8125rem',
        '4.5xl': '2.5rem',
        '5.5xl': '3.5rem',
      },
      gridTemplateRows: {
        12: 'repeat(12, minmax(0, 1fr))',
      },
      gridTemplateColumns: {
        12: 'repeat(12, minmax(0, 1fr))',
      },
      gridRowStart: {
        8: '8',
        9: '9',
        10: '10',
        11: '11',
        12: '12',
      },
      gridColumnStart: {
        8: '8',
        9: '9',
        10: '10',
        11: '11',
        12: '12',
      },
      height: {
        0.5: '0.125rem',
        0.75: '0.1875rem',
      },
      lineHeight: {
        '4.5xl': '2.75rem',
      },
      zIndex: {
        970: '970',
        980: '980',
        990: '990',
        1000: '1000',
        9999: '9999',
        10000: '1000',
      },
      margin: {
        13: '3.25rem',
      },
      maxHeight: {
        190: '190px',
        'full-viewport': 'calc(100vh - 5rem)',
        unset: 'unset',
      },
      minHeight: {
        1: '0.25rem',
        12: '3rem',
        800: '800px',
        100: '100px',
        150: '150px',
        200: '200px',
        unset: 'unset',
      },
      width: {
        '3-cols-center': 'calc(100% - 36rem)',
      },
      maxWidth: {
        80: '80px',
        150: '150px',
        600: '600px',
        730: '730px',
        900: '900px',
        1100: '1100px',
        1400: '1400px',
      },
      inset: {
        13: '3.25rem',
        25: '6.25rem',
      },
      padding: {
        full: '100%',
      },
    },
  },
  plugins: [],
}
