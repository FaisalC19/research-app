import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                neon: {
                    green: "#00ff9d",
                    blue: "#00ccff",
                    purple: "#bf00ff",
                },
                lab: {
                    dark: "#0a0a0a",
                    panel: "#121212",
                    border: "#333333",
                }
            },
            fontFamily: {
                heading: ["var(--font-outfit)", "sans-serif"],
                mono: ["var(--font-chakra)", "monospace"],
                sans: ["var(--font-inter)", "sans-serif"],
            },
            animation: {
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "glow": "glow 2s ease-in-out infinite alternate",
            },
            keyframes: {
                glow: {
                    "0%": { boxShadow: "0 0 5px #00ff9d20" },
                    "100%": { boxShadow: "0 0 20px #00ff9d60, 0 0 10px #00ff9d" },
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
