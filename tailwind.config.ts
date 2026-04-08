module.exports = {
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "var(--black)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        green: {
          50:  '#F0FAF4',
          100: '#E2F9EC',
          200: '#BFF9D8',
          300: '#8DF4BA',
          400: '#4DEE93',
          450: '#36F669',
          500: '#17E871',
          600: '#12BB5B',
          700: '#0E8D45',
          800: '#0A6933',
          900: '#074421',
          950: '#042914',
        },

        teal: {
          50:  '#F2FBFA',
          100: '#E6FBF9',
          150: '#D6FDF9',
          200: '#C5FFFB',
          300: '#98FFF7',
          350: '#81F7E6',
          400: '#5FFFF3',
          500: '#1DFFEE',
          600: '#00E5D4',
          700: '#00AFA2',
          800: '#008379',
          850: '#006D65',
          900: '#004F4A',
          950: '#003330',
        },

        forest: {
          50:  '#F3F6F4',
          100: '#E4EBE7',
          200: '#C9D6CE',
          300: '#ABBDB2',
          400: '#8AA396',
          500: '#6B8878',
          600: '#4A5D50',
          700: '#374A3E',
          800: '#253829',
          900: '#123726',
          950: '#0F1C14',
        },

        neutral: {
          50:  '#FBFBF8',
          100: '#F7F5EB',
          200: '#EBE9E1',
          300: '#DFDFD8',
          400: '#D4D2CB',
          500: '#B4B2AC',
          600: '#929087',
          700: '#737168',
          800: '#504E49',
          900: '#32322F',
          950: '#1D1D1B',
        },

        sand: {
          200: '#FFDE9F',
          300: '#FFD0C4',
          400: '#FFB6A4',
          500: '#FF9E88',
        },

        cream: {
          50:  '#FFFDF8',
          200: '#FFEDE9',
        },

        red: {
          50:  '#FBF0F0',
          600: '#D40404',
          700: '#A20303',
        },

        emerald: {
          50:  '#F0FAF5',
          700: '#047857',
          950: '#043017',
        },

        amber: {
          500: '#FFA726',
          700: '#B46B00',
        },

        'green-deep': '#021F0F',
      },

      fontFamily: {
        display: ['"Alumni Sans"', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        "display-medium": "var(--display-medium-font-family)",
        "headings-h2": "var(--headings-h2-font-family)",
        "headings-h3": "var(--headings-h3-font-family)",
        "label-regular-400": "var(--label-regular-400-font-family)",
        "label-small-400": "var(--label-small-400-font-family)",
        "label-small-500": "var(--label-small-500-font-family)",
        "label-xsmall": "var(--label-xsmall-font-family)",
        "paragraph-p-regular": "var(--paragraph-p-regular-font-family)",
        "paragraph-p-small": "var(--paragraph-p-small-font-family)",
      },

      fontWeight: {
        regular:    '400',
        medium:     '500',
        semibold:   '600',
        bold:       '700',
        extrabold:  '800',
      },

      fontSize: {
        '10': ['0.625rem',  { lineHeight: '1.2' }],
        '12': ['0.75rem',   { lineHeight: '1.33' }],
        '13': ['0.8125rem', { lineHeight: '1.38' }],
        '14': ['0.875rem',  { lineHeight: '1.4' }],
        '16': ['1rem',      { lineHeight: '1.5' }],
        '20': ['1.25rem',   { lineHeight: '1.3' }],
        '28': ['1.75rem',   { lineHeight: '1.2' }],
        '36': ['2.25rem',   { lineHeight: '1.1' }],
        '48': ['3rem',      { lineHeight: '1.05' }],
        '56': ['3.5rem',    { lineHeight: '1' }],
        '68': ['4.25rem',   { lineHeight: '0.95' }],
        '88': ['5.5rem',    { lineHeight: '0.9' }],
        '112':['7rem',      { lineHeight: '0.9' }],
      },

      spacing: {
        'aura-2':   '2px',
        'aura-4':   '4px',
        'aura-6':   '6px',
        'aura-8':   '8px',
        'aura-12':  '12px',
        'aura-14':  '14px',
        'aura-16':  '16px',
        'aura-20':  '20px',
        'aura-24':  '24px',
        'aura-28':  '28px',
        'aura-32':  '32px',
        'aura-40':  '40px',
        'aura-44':  '44px',
        'aura-48':  '48px',
        'aura-100': '100px',
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'xs':     '6px',
        'base':   '16px',
        'xl':     '24px',
        'alert':  '28px',
        '2xl':    '32px',
        'modal':  '40px',
        'full':   '9999px',
      },

      transitionDuration: {
        'fast':    '100ms',
        'normal':  '200ms',
        'slow':    '300ms',
        'x-slow':  '500ms',
        'xx-slow': '800ms',
      },

      transitionTimingFunction: {
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-out':    'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in':     'cubic-bezier(0.4, 0, 1, 1)',
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
  darkMode: ["class"],
};
