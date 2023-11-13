/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  theme: {
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1440px",
      // => @media (min-width: 1440px) { ... }
      "3xl": "1560px",
      // => @media (min-width: 1440px) { ... }
    },
    extend: {
      colors: {
        indigo: {
          DEFAULT: "#105277",
        },
        blue: {
          lighter: "#13A6FB",
          DEFAULT: "#1677ff",
          darker: "#0958d9",
        },
        grey: {
          lighter: "#f5f5f5",
          DEFAULT: "#00000073",
        },
        gray: {
          DEFAULT: "#cccccccc",
        },
        modal: {
          DEFAULT: "#8c8c8c33",
          darker: "#00000080",
        },
        black: {
          lighter: "#000000e0",
          DEFAULT: "#000",
        },
        green: {
          DEFAULT: "#28a745",
        },
      },
      spacing: {
        12.5: "3.125rem",
        15: "3.75rem",
        40: "10rem",
        42: "10.5rem",
        50: "12.5rem",
        51.25: "12.8175rem",
        56.25: "14.0625rem",
        75: "18.75rem",
        90: "22.5rem",
        100: "25rem",
        126: "31.5rem",
        137.5: "34.375rem",
        175: "43.75rem",
        200: "50rem",
        "1/20": "5%",
        "1/10": "10%",
        "1/8": "12.5%",
        "1/5": "20%",
        "1/4": "25%",
        "3/10": "30%",
        "9/20": "45%",
        "11/20": "55%",
      },
      fontSize: {
        "2xs": "0.8125rem",
        xml: "1.375rem",
      },
      maxWidth: {
        "1/4": "25%",
        "4/5": "80%",
      },
    },
  },
  plugins: [],
};
