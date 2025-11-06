/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // Tailwind blue-600
        secondary: "#9333ea", // Tailwind purple-600
        background: "#f9fafb",
        accent: "#f59e0b",
      },
      boxShadow: {
        soft: "0 4px 6px rgba(0,0,0,0.1)",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // Better form styling
    require("@tailwindcss/typography"), // For post text
    require("@tailwindcss/aspect-ratio"), // For image ratios
  ],
};
