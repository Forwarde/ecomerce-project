import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1d2d2b",
        forest: "#254f43",
        sand: "#f6f4ee",
        sage: "#e8eee7",
      },
    },
  },
  plugins: [],
};

export default config;
