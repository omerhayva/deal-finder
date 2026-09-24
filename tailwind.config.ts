import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#19221f",
        muted: "#68736e",
        canvas: "#f7f8f5",
        mint: "#dff1e9",
        coral: "#e96f50",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 18px 50px rgba(25, 34, 31, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
