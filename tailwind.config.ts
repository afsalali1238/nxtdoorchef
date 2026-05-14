import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream:       '#FFFBF5',
        'cream-dark':'#F5F0E8',
        'amber-bg':  '#FEF3C7',
        saffron:     '#D4780A',
        terra:       '#B8390A',
        dark:        '#1A0A00',
        spice:       '#4A1E00',
        muted:       '#7A6550',
        border:      '#E8DFD0',
        'wa-green':  '#16a34a',
        verified:    '#065F46',
        'verified-bg':'#D1FAE5',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        chip: '50px',
      },
      height: {
        nav: '62px',
      },
      spacing: {
        nav: '62px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(26,15,6,.07), 0 6px 20px rgba(26,15,6,.06)',
        'card-hover': '0 4px 12px rgba(26,15,6,.10), 0 12px 32px rgba(26,15,6,.08)',
      },
    },
  },
  plugins: [],
}

export default config
