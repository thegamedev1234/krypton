import type { Config } from "tailwindcss";

/**
 * KRYPTON design tokens.
 *
 * Every colour is driven by a CSS custom property (RGB triplet) defined in
 * `src/app/globals.css`, which lets the whole interface switch between the
 * dark-first "Midnight" theme and the "Daylight" theme without duplicating
 * utility classes.
 */
const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        raised: "rgb(var(--raised) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        lineStrong: "rgb(var(--line-strong) / <alpha-value>)",
        "line-strong": "rgb(var(--line-strong) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        inkSoft: "rgb(var(--ink-soft) / <alpha-value>)",
        "ink-soft": "rgb(var(--ink-soft) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        faint: "rgb(var(--faint) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        accentStrong: "rgb(var(--accent-strong) / <alpha-value>)",
        "accent-strong": "rgb(var(--accent-strong) / <alpha-value>)",
        accentInk: "rgb(var(--accent-ink) / <alpha-value>)",
        violet: "rgb(var(--violet) / <alpha-value>)",
        ice: "rgb(var(--ice) / <alpha-value>)",
        positive: "rgb(var(--positive) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.04em" }],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        panel: "0 24px 70px -30px rgb(0 0 0 / 0.75)",
        composer: "0 20px 60px -32px rgb(0 0 0 / 0.85)",
        pop: "0 18px 46px -18px rgb(0 0 0 / 0.7)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "dot-pulse": {
          "0%, 80%, 100%": { opacity: "0.25", transform: "scale(0.85)" },
          "40%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 180ms ease-out both",
        "fade-up": "fade-up 220ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "scale-in": "scale-in 140ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-in-left": "slide-in-left 220ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "dot-pulse": "dot-pulse 1.2s ease-in-out infinite",
        shimmer: "shimmer 1.8s ease-in-out infinite",
      },
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
