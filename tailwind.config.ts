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
        },
        trade: {
          bg: "#101213",
          panel: "#17191b",
          card: "#1b1e20",
          line: "rgba(255,255,255,0.10)",
          green: "#1fbf75",
          red: "#ff4d5e",
          blue: "#4579ff",
          purple: "#8d36ff",
          gold: "#ffaf24"
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
