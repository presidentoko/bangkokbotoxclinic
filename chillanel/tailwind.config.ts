import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        "bg-elev": "rgb(var(--bg-elev) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-warm": "rgb(var(--accent-warm) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-elev": "rgb(var(--ink-elev) / <alpha-value>)",
        "on-ink": "rgb(var(--on-ink) / <alpha-value>)",
        "on-ink-muted": "rgb(var(--on-ink-muted) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
