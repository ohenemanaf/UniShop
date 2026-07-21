/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "screens": {
        "sm": "640px",
        "md": "768px",
        "lg": "1024px",
        "xl": "1280px",
        "2xl": "1536px"
      },
      "colors": {
        "background": "#FFFFFF",
        "on-background": "#0F172A",
        "surface": "#FFFFFF",
        "surface-bright": "#FFFFFF",
        "surface-dim": "#F8FAFC",
        "surface-variant": "#F1F5F9",
        "on-surface": "#0F172A",
        "on-surface-variant": "#475569",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F8FAFC",
        "surface-container": "#F1F5F9",
        "surface-container-high": "#E2E8F0",
        "surface-container-highest": "#CBD5E1",
        
        "primary": "#1D4ED8", // Trust Blue 700
        "on-primary": "#FFFFFF",
        "primary-container": "#DBEAFE",
        "on-primary-container": "#1E3A8A",
        "primary-fixed": "#1E40AF",
        "primary-fixed-dim": "#1E3A8A",
        "on-primary-fixed": "#FFFFFF",
        "on-primary-fixed-variant": "#93C5FD",
        "inverse-primary": "#FFFFFF",
        
        "secondary": "#0284C7", // Sky 600 for airy feel
        "on-secondary": "#FFFFFF",
        "secondary-container": "#E0F2FE",
        "on-secondary-container": "#0C4A6E",
        "secondary-fixed": "#0369A1",
        "secondary-fixed-dim": "#075985",
        "on-secondary-fixed": "#FFFFFF",
        "on-secondary-fixed-variant": "#7DD3FC",
        
        "tertiary": "#4338CA", // Indigo 700 for depth
        "on-tertiary": "#FFFFFF",
        "tertiary-container": "#E0E7FF",
        "on-tertiary-container": "#312E81",
        "tertiary-fixed": "#3730A3",
        "tertiary-fixed-dim": "#312E81",
        "on-tertiary-fixed": "#FFFFFF",
        "on-tertiary-fixed-variant": "#A5B4FC",
        
        "error": "#DC2626",
        "on-error": "#FFFFFF",
        "error-container": "#FEE2E2",
        "on-error-container": "#991B1B",
        
        "outline": "#E2E8F0",
        "outline-variant": "#F1F5F9",
        "inverse-surface": "#0F172A",
        "inverse-on-surface": "#F8FAFC"
      },
      "borderRadius": {
        "none": "0px",
        "DEFAULT": "3px",
        "sm": "3px",
        "md": "3px",
        "lg": "3px",
        "xl": "3px",
        "2xl": "3px",
        "3xl": "3px",
        "full": "3px"
      },
      "maxWidth": {
        "xs": "20rem",
        "sm": "24rem",
        "md": "28rem",
        "lg": "32rem",
        "xl": "36rem",
        "2xl": "42rem",
        "3xl": "48rem",
        "4xl": "56rem",
        "5xl": "64rem",
        "6xl": "72rem",
        "7xl": "80rem"
      },

      "fontFamily": {
        "sans": ["Manrope", "sans-serif"],
        "headline-xl": ["Manrope", "sans-serif"],
        "headline-lg": ["Manrope", "sans-serif"],
        "headline-lg-mobile": ["Manrope", "sans-serif"],
        "headline-md": ["Manrope", "sans-serif"],
        "body-md": ["Manrope", "sans-serif"],
        "label-md": ["Manrope", "sans-serif"],
        "body-lg": ["Manrope", "sans-serif"],
        "label-sm": ["Manrope", "sans-serif"]
      },
      "fontSize": {
        "headline-xl": ["56px", { "lineHeight": "1.1", "letterSpacing": "-0.03em", "fontWeight": "800" }],
        "headline-lg": ["40px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "800" }],
        "headline-lg-mobile": ["32px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "headline-md": ["24px", { "lineHeight": "1.3", "letterSpacing": "-0.01em", "fontWeight": "700" }],
        "body-md": ["16px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "label-md": ["14px", { "lineHeight": "1.5", "letterSpacing": "0.02em", "fontWeight": "600" }],
        "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "label-sm": ["12px", { "lineHeight": "1.5", "letterSpacing": "0.02em", "fontWeight": "500" }]
      },
      "boxShadow": {
        "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "md": "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        "level-1": "0px 8px 24px -4px rgba(15, 23, 42, 0.08), 0px 4px 12px -2px rgba(15, 23, 42, 0.04)",
        "level-2": "0px 20px 40px -8px rgba(15, 23, 42, 0.12), 0px 8px 16px -4px rgba(15, 23, 42, 0.06)",
        "level-3": "0px 32px 64px -12px rgba(15, 23, 42, 0.16), 0px 16px 32px -8px rgba(15, 23, 42, 0.08)",
        "inner-glow": "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
        "float": "0 20px 40px -10px rgba(0, 0, 0, 0.1)"
      },
      "keyframes": {
        "fade-in-up": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.8 }
        }
      },
      "animation": {
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite"
      }
    }
  },
  plugins: [],
}
