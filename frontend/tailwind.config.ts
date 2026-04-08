/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E50914",
          hover: "#B20710",
          light: "#FDE8E8",
        },
        dark: {
          DEFAULT: "#0F172A",
          soft: "#1E293B",
          card: "#111827",
        },
        text: {
          primary: "#111827",
          secondary: "#6B7280",
        },
      },
      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
    },
  },
  plugins: [],
};
