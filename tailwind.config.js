/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lightGray: "#f9f9f9",
        textPrimary: "#0d0d0d",
        textSecondary: "#5d5d5d",
        borderLight: "rgba(0, 0, 0, .1)",
        borderColor: "#e5e7eb",
        borderBlack: "#0000001a",
        messageBackground: "hsla(0,0%,91%,.5)",
        transparentBlack: "#00000080",
      },
    },
  },
  plugins: [],
};
