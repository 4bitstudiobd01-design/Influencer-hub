import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#141414',
          soft: '#1f1f1f',
        },
        canvas: '#FAFAF7',
        forest: {
          DEFAULT: '#1F6D4C',
          light: '#2E9166',
          dark: '#154D36',
        },
        amber: {
          DEFAULT: '#F5A524',
          light: '#FFD08A',
        },
        decline: '#E5484D',
        ink: {
          50: '#F5F5F4',
          100: '#E9E9E7',
          400: '#8A8A85',
          600: '#57564F',
          900: '#1C1B18',
        },
        platform: {
          youtube: '#FF0000',
          instagram: '#E1306C',
          facebook: '#1877F2',
          tiktok: '#000000',
          whatsapp: '#25D366',
        },
      },
      boxShadow: {
        card: '0 4px 24px rgba(20,20,20,0.06)',
        'card-hover': '0 12px 32px rgba(20,20,20,0.10)',
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(31,109,76,0.25)',
      },
      borderRadius: {
        card: '20px',
        pill: '999px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'hero-mesh':
          'radial-gradient(circle at 15% 20%, rgba(46,145,102,0.55) 0, transparent 45%), radial-gradient(circle at 85% 0%, rgba(245,165,36,0.35) 0, transparent 40%), radial-gradient(circle at 50% 100%, rgba(255,255,255,0.08) 0, transparent 60%)',
        'card-sheen': 'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0) 60%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite linear',
        'fade-up': 'fade-up 0.35s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
