import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }] as [string, { lineHeight: string }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "bounce-subtle": "bounceSubtle 2s infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "soft": "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        "medium": "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "large": "0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)",
        "glow": "0 0 20px rgba(59, 130, 246, 0.15)",
        "glow-lg": "0 0 40px rgba(59, 130, 246, 0.2)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-mesh": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-sunset": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        "gradient-ocean": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        "gradient-forest": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      },
      // Accessibility enhancements
      colors: {
        // High contrast colors
        'high-contrast': {
          'bg': '#000000',
          'text': '#ffffff',
          'primary': '#ffff00',
          'secondary': '#00ffff',
        },
      },
    },
  },
  plugins: [
    // Custom accessibility utilities
    function({ addUtilities, addComponents, theme }: any) {
      // Screen reader only utilities
      addUtilities({
        '.sr-only': {
          'position': 'absolute',
          'width': '1px',
          'height': '1px',
          'padding': '0',
          'margin': '-1px',
          'overflow': 'hidden',
          'clip': 'rect(0, 0, 0, 0)',
          'white-space': 'nowrap',
          'border': '0',
        },
        '.focus\\:not-sr-only:focus': {
          'position': 'static',
          'width': 'auto',
          'height': 'auto',
          'padding': 'inherit',
          'margin': 'inherit',
          'overflow': 'visible',
          'clip': 'auto',
          'white-space': 'normal',
        },
        '.focus-visible': {
          'outline': '2px solid transparent',
          'outline-offset': '2px',
        },
        '.focus-visible:focus-visible': {
          'outline': '2px solid #3b82f6',
          'outline-offset': '2px',
        },
      });

      // High contrast mode styles
      addComponents({
        '.high-contrast': {
          '& *': {
            'background-color': theme('colors.high-contrast.bg'),
            'color': theme('colors.high-contrast.text'),
            'border-color': theme('colors.high-contrast.text'),
          },
          '& button, & [role="button"]': {
            'background-color': theme('colors.high-contrast.primary'),
            'color': theme('colors.high-contrast.bg'),
            'border': `2px solid ${theme('colors.high-contrast.text')}`,
          },
          '& a': {
            'color': theme('colors.high-contrast.secondary'),
            'text-decoration': 'underline',
          },
        },
        '.reduced-motion': {
          '& *, & *::before, & *::after': {
            'animation-duration': '0.01ms !important',
            'animation-iteration-count': '1 !important',
            'transition-duration': '0.01ms !important',
            'scroll-behavior': 'auto !important',
          },
        },
        '.large-text': {
          '& *': {
            'font-size': '1.2em',
            'line-height': '1.6',
          },
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            'font-size': '1.4em',
          },
        },
      });
    },
  ],
};

export default config; 