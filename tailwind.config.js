/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#293F33",
          50: "#EAEEF5",
          600: "#1B3A63",
          900: "#0A1730",
        },
        brand: {
          red: "#9D613E",
          amber: "#A9750B",
          green: "#6E8B4E",
        },
        cream: {
          DEFAULT: "#FAF9F5",
          soft: "#F5EFE3",
          card: "#FFFFFF",
        },
        line: "#E7DFD0",
        muted: "#767E70",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      maxWidth: { app: "480px" },
      boxShadow: {
        sheet: "0 -8px 30px rgba(15,35,64,0.14)",
        card: "0 2px 10px rgba(15,35,64,0.06)",
        bar: "0 -2px 14px rgba(15,35,64,0.10)",
      },
      borderRadius: { xl2: "20px" },
    },
  },
  plugins: [],
};

