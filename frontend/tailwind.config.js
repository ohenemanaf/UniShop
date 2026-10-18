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
        "background": "#F7F8F4",
        "on-background": "#182D26",
        "surface": "#FFFFFF",
        "surface-bright": "#FFFFFF",
        "surface-dim": "#F0F3ED",
        "surface-variant": "#EAF0E9",
        "on-surface": "#182D26",
        "on-surface-variant": "#59675F",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F0F3ED",
        "surface-container": "#EAF0E9",
        "surface-container-high": "#DFE7DC",
        "surface-container-highest": "#CCD8CA",
        
        "primary": "#185C43", // UniShop evergreen
        "on-primary": "#FFFFFF",
        "primary-container": "#E0EFE4",
        "on-primary-container": "#164331",
        "primary-fixed": "#114631",
        "primary-fixed-dim": "#0D3526",
        "on-primary-fixed": "#FFFFFF",
        "on-primary-fixed-variant": "#B8DEC7",
        "inverse-primary": "#FFFFFF",
        
        "secondary": "#8A5210", // Warm amber accent
        "on-secondary": "#FFFFFF",
        "secondary-container": "#FFF0D4",
        "on-secondary-container": "#653A08",
        "secondary-fixed": "#70400A",
        "secondary-fixed-dim": "#583108",
        "on-secondary-fixed": "#FFFFFF",
        "on-secondary-fixed-variant": "#F0CC91",
        
        "tertiary": "#185C43", // Supporting brand tone
        "on-tertiary": "#FFFFFF",
        "tertiary-container": "#E0EFE4",
        "on-tertiary-container": "#164331",
        "tertiary-fixed": "#114631",
        "tertiary-fixed-dim": "#0D3526",
        "on-tertiary-fixed": "#FFFFFF",
        "on-tertiary-fixed-variant": "#B8DEC7",
        
        "success": "#237447",
        "scrim": "#10271B",
        "error": "#DC2626",
        "on-error": "#FFFFFF",
        "error-container": "#FEE2E2",
        "on-error-container": "#991B1B",
        
        "outline": "#CDD8CD",
        "outline-variant": "#E1E7DE",
        "inverse-surface": "#182D26",
        "inverse-on-surface": "#F7F8F4"
      },
      "borderRadius": { "none": "0px", "DEFAULT": "8px", "sm": "4px", "md": "8px", "lg": "12px", "xl": "16px", "2xl": "24px", "3xl": "32px", "full": "9999px" },
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
