/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Temenos brand blue — rgb(33, 42, 118) = #212A76 anchored at 700
        indigo: {
          50:  "#f0f1fa",
          100: "#dfe2f4",
          200: "#c2c7e9",
          300: "#939dd8",
          400: "#6370c4",
          500: "#3a48a8",
          600: "#2b368c",
          700: "#212a76",
          800: "#1a215f",
          900: "#14194a",
        },
      },
    },
  },
  plugins: [],
};
