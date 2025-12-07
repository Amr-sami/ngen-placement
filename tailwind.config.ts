import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './config/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      safelist: [
        {
          pattern: /(bg|text|border).*/,
        },
      ],
      fontFamily: {
        protestRiot: 'var(--font-protestRiot)',
      },
      colors: {
        pumpkin: '#ff7723',
        ninja: '#944268',
        grandmaster: '#96819f',
        purple: {
          darker: '#2E1660',
          dark: '#3B117F',
          default: '#c48cdf',
          light: '#E6CFF2',
          lighter: '#F0E3F7',
        },
        gray: {
          tertiary: '#808080',
          default: '#F5F5F5',
          dark: '#878787',
        },
        blueberry: '#627CEE',
        green: '#0BCA6C',
        yellow: '#EFD43E',
        rose: '#F659A0',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        for_indviduals: 'linear-gradient(180deg, #DDE3FF 0%, #4E63BE 150%)',
        for_schools: 'linear-gradient(180deg, #FBE7F0 0%, #F659A0 150%)',
        for_corporates: 'linear-gradient(180deg, #FFEEE3 0%, #FF7723 150%)',
        for_parents: 'linear-gradient(180deg, #E4FFF2 0%, #0BCA6C 150%)',
      },
      animation: {
        'bounce-slow': 'bounce 4s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
