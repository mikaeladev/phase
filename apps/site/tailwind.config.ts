import { type Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        "geist-sans": ["var(--font-geist-sans)"],
      },
      backgroundImage: {
        phase: "linear-gradient(45deg, #7000FF, #DB00FF)",
        main: "url(/bg.png)",
        grid: "url(/docs/bg-grid.png)",
      },
      colors: {
        "dark-900": "rgb(16 16 16)",
        "dark-800": "rgb(24 24 24)",
        "dark-700": "rgb(32 32 32)",
        "dark-600": "rgb(40 40 40)",
        "dark-500": "rgb(48 48 48)",
        "dark-400": "rgb(56 56 56)",
        "dark-300": "rgb(64 64 64)",
        "dark-200": "rgb(72 72 72)",
        "dark-100": "rgb(80 80 80)",
        "light-900": "rgb(256 256 256)",
        "light-800": "rgb(248 248 248)",
        "light-700": "rgb(240 240 240)",
        "light-600": "rgb(232 232 232)",
        "light-500": "rgb(224 224 224)",
        "light-400": "rgb(216 216 216)",
        "light-300": "rgb(208 208 208)",
        "light-200": "rgb(200 200 200)",
        "light-100": "rgb(192 192 192)",
        "phase": "rgb(164 0 255)",
      },
      width: { //@ts-ignore
        "fill-available": ["-webkit-fill-available", "-moz-available"],
      },
      height: { //@ts-ignore
        "dvh": ["100dvh", "100vh"],
      },
      minHeight: { //@ts-ignore
        "dvh": ["100dvh", "100vh"],
      },
      maxHeight: { //@ts-ignore
        "dvh": ["100dvh", "100vh"],
      },
    },
  },
  plugins: [
    plugin(function({ addVariant }) {
      addVariant('children', '&>*')
    }),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "animation-delay": (value) => {
            return {
              "animation-delay": value,
            }
          },
        },
        {
          values: theme("transitionDelay"),
        },
      )
    }),
  ],
}

export default config