/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      transitionProperty: {
        left: "left",
      },
      colors: {
        lightGray: "#f9f9f9",
        textPrimary: "#0d0d0d",
        textSecondary: "#5d5d5d",
        borderLight: "rgba(0, 0, 0, .1)",
        borderColor: "#e5e7eb",
        borderBlack: "#0000001a",
        messageBackground: "hsla(0,0%,91%,.5)",
        transparentBlack: "#00000080",
        buttonGreen: "#10a37f",
        textError: "#f93a37",

        //dark
        darkMainSurfacePrimary: "#212121",
        darkMainSurfaceSecondary: "#2f2f2f",
        darkMainSurcaceTertiary: "#424242",
        darkLightGray: "#171717",
        darkTextPrimary: "#ececec",
        darkTextSecondary: "#b4b4b4",
        darkMessageBackground: "rgba(50,50,50,.85)",
        darkBorderLight: "hsla(0,0%,100%,.1)",
        darkBorderColor: "hsla(0,0%,100%,.15)",
      },
    },
  },
  plugins: [],
};
