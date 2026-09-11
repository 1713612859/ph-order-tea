/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#061D3B",
          50: "#EAF0F8",
          600: "#244C80",
          900: "#03142B",
        },
        brand: {
          red: "#E60012",
          amber: "#9B6A32",
          green: "#6E8B4E",
        },
        cream: {
          DEFAULT: "#F7F4EE",
          soft: "#F0EDE4",
          card: "#FFFFFF",
        },
        line: "#E8E4D9",
        muted: "#767E70",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "Inter Variable",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
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
