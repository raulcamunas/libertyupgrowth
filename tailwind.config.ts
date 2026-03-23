import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#00b5ff',
        'bg-dark': '#080808',
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.03)',
      },
      borderColor: {
        'glass': 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
}
export default config

