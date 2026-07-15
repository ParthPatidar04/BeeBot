/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        canvas: "#EEF0F3",
        accent: {
          DEFAULT: "#6C63F5",
          light: "#8B84F7",
          dark: "#5751D6",
        },
        muted: "#9AA0AC",
        ink: "#16181D",
      },
      borderRadius: {
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};
