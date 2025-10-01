/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
        extend: {
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                },
                colors: {
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        }
                },
                fontFamily: {
                        'arabic': ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
                },
                backdropBlur: {
                        xs: '2px',
                },
                transitionDelay: {
                        '100': '100ms',
                        '200': '200ms',
                        '300': '300ms',
                        '400': '400ms',
                        '500': '500ms',
                        '700': '700ms',
                        '1000': '1000ms',
                },
                keyframes: {
                        'accordion-down': {
                                from: {
                                        height: '0'
                                },
                                to: {
                                        height: 'var(--radix-accordion-content-height)'
                                }
                        },
                        'accordion-up': {
                                from: {
                                        height: 'var(--radix-accordion-content-height)'
                                },
                                to: {
                                        height: '0'
                                }
                        }
                        fadeInUp: {
                                '0%': { opacity: '0', transform: 'translateY(30px)' },
                                '100%': { opacity: '1', transform: 'translateY(0)' },
                        },
                        fadeInDown: {
                                '0%': { opacity: '0', transform: 'translateY(-30px)' },
                                '100%': { opacity: '1', transform: 'translateY(0)' },
                        },
                        slideInRight: {
                                '0%': { opacity: '0', transform: 'translateX(50px)' },
                                '100%': { opacity: '1', transform: 'translateX(0)' },
                        },
                        slideInLeft: {
                                '0%': { opacity: '0', transform: 'translateX(-50px)' },
                                '100%': { opacity: '1', transform: 'translateX(0)' },
                        },
                        bounceIn: {
                                '0%': { opacity: '0', transform: 'scale(0.3)' },
                                '50%': { transform: 'scale(1.05)' },
                                '70%': { transform: 'scale(0.9)' },
                                '100%': { opacity: '1', transform: 'scale(1)' },
                        },
                        float: {
                                '0%, 100%': { transform: 'translateY(0px)' },
                                '50%': { transform: 'translateY(-20px)' },
                        },
                        glow: {
                                '0%, 100%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
                                '50%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6)' },
                        'fadeInUp': 'fadeInUp 0.8s ease-out',
                        'fadeInDown': 'fadeInDown 0.8s ease-out',
                        'slideInRight': 'slideInRight 0.8s ease-out',
                        'slideInLeft': 'slideInLeft 0.8s ease-out',
                        'bounceIn': 'bounceIn 0.6s ease-out',
                        'float': 'float 3s ease-in-out infinite',
                        'glow': 'glow 2s ease-in-out infinite alternate',
                        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        },
                },
                animation: {
                        'accordion-down': 'accordion-down 0.2s ease-out',
                        'accordion-up': 'accordion-up 0.2s ease-out'
                }
        }
  },
  plugins: [require("tailwindcss-animate")],
};