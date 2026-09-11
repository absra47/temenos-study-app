/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Accent scale — driven by CSS variables so the in-app theme switcher
        // can swap the whole app's accent color at runtime. Defaults (set in
        // globals.css) are the Temenos brand blue, rgb(33,42,118) at 700.
        indigo: {
          50:  "var(--accent-50)",
          100: "var(--accent-100)",
          200: "var(--accent-200)",
          300: "var(--accent-300)",
          400: "var(--accent-400)",
          500: "var(--accent-500)",
          600: "var(--accent-600)",
          700: "var(--accent-700)",
          800: "var(--accent-800)",
          900: "var(--accent-900)",
        },
        // Neutral scale — also variable-driven, so Light/Dark/System mode
        // repaints every bg-slate-*/text-slate-*/border-slate-* class at once.
        slate: {
          50:  "var(--slate-50)",
          100: "var(--slate-100)",
          200: "var(--slate-200)",
          300: "var(--slate-300)",
          400: "var(--slate-400)",
          500: "var(--slate-500)",
          600: "var(--slate-600)",
          700: "var(--slate-700)",
          800: "var(--slate-800)",
          900: "var(--slate-900)",
        },
        // Card/panel surface — replaces literal bg-white so cards also flip
        // in dark mode; the sticky header etc. use bg-surface too.
        surface: "var(--surface)",
      },
    },
  },
  plugins: [],
};
