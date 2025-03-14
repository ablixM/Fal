/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Poppins-Regular",
          "Inter-Regular",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1800px",
      "4xl": "2000px",
    },
    colors: {
      primary: "#3FFF7F",
      secondary: "#17213C",
      tertiary: "#18A146",
      quaternary: "#3FFF7F",
      quinary: "#3FFF7F",
    },
  },
  plugins: [],
};
