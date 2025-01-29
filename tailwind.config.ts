import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        moss: '#6f7302',
        grass: '#595302',
        root: '#403c01',
        bark: '#262001',
        dirt: '#260f01',
        blood: '#4d0707',
        dusk: '#8c0d0d',
        sunset: '#f22816',
        sun: '#f2e6c2',
      },
    },
  },
  plugins: [],
} satisfies Config
