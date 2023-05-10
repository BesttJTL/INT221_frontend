/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],

  daisyui: { styled: true, themes: [ { dark: { ...require("daisyui/src/colors/themes")["[data-theme=dark]"], "base-100": "#252525",}, }, 
], 
},
  base:false
}