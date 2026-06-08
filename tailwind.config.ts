import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        office: {
          bg: "#070b12",
          panel: "#101826",
          card: "#162132",
          line: "#26364d",
          glow: "#34d399",
          cyan: "#38bdf8",
          danger: "#fb7185",
          warn: "#fbbf24"
        }
      },
      boxShadow: {
        neon: "0 0 32px rgba(52, 211, 153, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
