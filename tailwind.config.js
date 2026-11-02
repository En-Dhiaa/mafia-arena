/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#d4af37", // Signature mafia gold
          600: "#b89428",
          700: "#92721d",
          800: "#785c1a",
          900: "#45340f",
        },
        obsidian: {
          950: "#07070a",
          900: "#0d0e15",
          800: "#13141f",
          700: "#1b1d2d",
        },
        noir: {
          dark: "#0b0c10",
          card: "#151722",
          border: "#26293d",
          muted: "#8c92a4",
        },
        mafia: {
          DEFAULT: "#dc2626",
          dark: "#991b1b",
          glow: "rgba(220, 38, 38, 0.4)",
        },
        citizen: {
          DEFAULT: "#2563eb",
          dark: "#1d4ed8",
          glow: "rgba(37, 99, 235, 0.4)",
        },
        arbiter: {
          DEFAULT: "#9333ea",
          dark: "#7e22ce",
          glow: "rgba(147, 51, 234, 0.4)",
        },
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "system-ui", "sans-serif"],
        display: ["var(--font-cinzel)", "var(--font-cairo)", "serif"],
        mono: ["monospace"],
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-gold": "glowGold 2s ease-in-out infinite alternate",
        "card-flip": "cardFlip 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
      },
      keyframes: {
        glowGold: {
          "0%": { boxShadow: "0 0 10px rgba(212, 175, 55, 0.2)" },
          "100%": { boxShadow: "0 0 25px rgba(212, 175, 55, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};

