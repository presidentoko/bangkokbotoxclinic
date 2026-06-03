import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Premium medical: warm cream + deep navy + gold accent
        ink: {
          50: "#fbfaf6", 100: "#f4f1e8", 150: "#ebe6d8", 200: "#d8d1bf",
          300: "#a89e8a", 400: "#766c5a", 500: "#4d4536", 600: "#332e23",
          700: "#1f1b13", 800: "#13110b", 900: "#0a0905", 950: "#050402",
        },
        // Primary brand: deep navy (trust + medical authority)
        navy: {
          50: "#f0f3f9", 100: "#dde3ee", 200: "#bcc8da", 300: "#94a4bf",
          400: "#6c7fa3", 500: "#4a5d82", 600: "#384867", 700: "#28344c",
          800: "#1a2336", 900: "#0f1626", 950: "#070b16",
        },
        // Gold accent (premium, partner badge, CTA highlights)
        gold: {
          50: "#fcf9f0", 100: "#f8f1d6", 200: "#f0deaa", 300: "#e6c476",
          400: "#dcaa4a", 500: "#c98f2c", 600: "#a87122", 700: "#85561f",
          800: "#6b441f", 900: "#5a391d", 950: "#341e0d",
        },
        // Clinic-mint (trust score "high" + verified)
        mint: {
          50: "#f0fdf6", 100: "#dbfbe9", 200: "#b8f5d2", 300: "#86eab1",
          400: "#4dd589", 500: "#27ba6a", 600: "#199955", 700: "#177846",
          800: "#175f3a", 900: "#144e32", 950: "#062b1a",
        },
        // Legacy aliases for backwards compat with existing components
        clinic: {
          DEFAULT: "#28344c",  // navy-700
          deep: "#1a2336",     // navy-800
          violet: "#7c5fb8",
        },
        "clinic-deep": "#1a2336",
        "clinic-violet": "#7c5fb8",
        "trust-high": "#199955",
        "trust-mid": "#dcaa4a",
        "trust-low": "#c14a3d",
        "trust-mint": "#27ba6a",
      },
      fontFamily: {
        // Serif display for premium feel (headlines)
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        // Sans body — Plus Jakarta Sans (modern, premium SaaS look)
        sans: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "system-ui", "Noto Sans KR", "Noto Sans Thai", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        "tighter-display": "-0.04em",
      },
      animation: {
        "ring-draw": "ring-draw 1.4s cubic-bezier(0.65,0,0.35,1) forwards",
        "shimmer": "shimmer 2.5s linear infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "blob": "blob 14s ease-in-out infinite",
        "marquee": "marquee 30s linear infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        "ring-draw": { from: { strokeDashoffset: "var(--end)" }, to: { strokeDashoffset: "var(--target)" } },
        "shimmer": { "0%": { backgroundPosition: "-1000px 0" }, "100%": { backgroundPosition: "1000px 0" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "blob": {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(20px,-30px) scale(1.1)" },
          "66%": { transform: "translate(-20px,20px) scale(0.95)" },
        },
        "marquee": { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        "float": { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
      },
      backgroundImage: {
        "grid-light": "linear-gradient(to right, rgba(15,22,38,.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,22,38,.04) 1px, transparent 1px)",
        "grid-dark":  "linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px)",
        "premium-gradient": "linear-gradient(135deg, #0f1626 0%, #28344c 50%, #4a5d82 100%)",
        "gold-gradient": "linear-gradient(135deg, #dcaa4a 0%, #c98f2c 50%, #a87122 100%)",
      },
      boxShadow: {
        "premium": "0 20px 60px -20px rgba(15,22,38,0.25), 0 8px 24px -8px rgba(15,22,38,0.15)",
        "premium-lg": "0 32px 80px -24px rgba(15,22,38,0.35), 0 12px 32px -8px rgba(15,22,38,0.2)",
        "gold-glow": "0 12px 32px -8px rgba(220,170,74,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
