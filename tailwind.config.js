/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--notojp-font)",
          "Noto Sans JP",
          ...defaultTheme.fontFamily.sans,
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              "padding-bottom": "0.5rem",
              "border-bottom": "4px solid lightgray",
            },
            h2: {
              "padding-bottom": "0.25rem",
              "border-bottom": "2px solid lightgray",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
