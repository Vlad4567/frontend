/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      lg: '1024px',
      xl: '1440px',
    },
    colors: {
      error: '#f43e34',
      link: '#ff4b4b',
      info: '#417eff',
      warning: '#feb600',
      success: '#00c662',

      gray: {
        100: '#ffffff',
        80: '#f5f7f9',
        70: '#edeff3',
        50: '#d0d1d8',
        30: '#a09fa6',
        20: '#5c5c60',
        15: '#323232',
        10: '#1a1b1e',
        5: '#141414',
      },

      pink: '#ffdbdb',
      secondaryPink: '#fcb3b3',
      blue: '#d6f0fa',

      primary: {
        100: '#ff4b4b',
      },
    },
    fontFamily: {
      urbanist: ['Urbanist', 'sans-serif'],
      kharkivTone: ['Kharkiv-Tone', 'sans-serif'],
    },
    borderWidth: {
      0: '0',
      lineWidth: '1.5px',
    },
    borderRadius: {
      25: '6.25rem',
    },
    width: {
      fit: 'fit-content',
      6.25: '1.5625rem',
      25: '6.25rem',
      32.5: '8.125rem',
    },
    height: {
      fit: 'fit-content',
      6.25: '1.5625rem',
      10: '2.5rem',
      12.5: '3.125rem',
      25: '6.25rem',
    },
    gap: {
      2.5: '0.625rem',
      7.5: '1.875rem',
      10: '2.5rem',
    },
    extend: {},
  },
  plugins: [],
};
