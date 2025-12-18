import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        adhesive: ['"Adhesive NR. Eight"', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
