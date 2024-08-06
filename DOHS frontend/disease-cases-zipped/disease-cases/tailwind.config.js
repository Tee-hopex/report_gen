// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["/src/index.html"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "custom-teal": "#38A3A5",
      },
    },
  },
  plugins: [],
};
