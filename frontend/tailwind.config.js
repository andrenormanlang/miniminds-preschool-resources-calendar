/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      fontSize: {
        "xs-mobile": ["0.7rem", { lineHeight: "1rem" }],
        "sm-mobile": ["0.8rem", { lineHeight: "1.25rem" }],
        "base-mobile": ["0.9rem", { lineHeight: "1.5rem" }],
      },
      maxWidth: {
        "screen-xs": "475px",
      },
    },
  },
  plugins: [],
};
