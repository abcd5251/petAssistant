import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lilita: ['"Lilita One"', "cursive"],
      },
      colors: {
        "background-gray": "#353C52",
        "background-light-blue": "#248EF6",
        "background-blue": "#105DE5",
      },
      boxShadow: {
        custom: "-3.16px 12.63px 0px 0px #000000",
      },
      borderWidth: {
        custom: "5.05px",
      },
    },
  },
  plugins: [],
};

export default config;
