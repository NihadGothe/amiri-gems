/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Amiri Gems Brand Colors
        gold: {
          DEFAULT: '#B8974A',
          light: '#D4B468',
          dark: '#8B6E2F',
          50: '#FAF6EC',
          100: '#F0E4C0',
          200: '#E6D294',
          300: '#D4B468',
          400: '#C4A04C',
          500: '#B8974A',
          600: '#8B6E2F',
          700: '#6B5424',
          800: '#4A3A1A',
          900: '#2A210F',
        },
        taupe: {
          DEFAULT: '#8B7B6B',
          light: '#A89585',
          dark: '#6B5B4B',
          footer: '#7A6A5A',
          50: '#F5F0EB',
          100: '#E8DDD5',
          200: '#D4C4B8',
          300: '#BFAA9A',
          400: '#A89585',
          500: '#8B7B6B',
          600: '#7A6A5A',
          700: '#6B5B4B',
          800: '#4A3D35',
          900: '#2A231E',
        },
        navy: {
          DEFAULT: '#1A2744',
          light: '#243560',
          dark: '#0F1A2E',
        },
        cream: {
          DEFAULT: '#FAF8F5',
          warm: '#F5F0E8',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        'serif-italic': ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      letterSpacing: {
        widest: '0.3em',
        luxury: '0.15em',
        ultra: '0.4em',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'luxury-overlay': 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
        'hero-overlay': 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.5) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
