import { defineConfig } from "astro/config"
import { loadEnv } from "vite"

import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import tailwindcss from "@tailwindcss/vite"

// loads environment variables
process.env = loadEnv(process.env.NODE_ENV!, process.cwd(), "")

// validates environment variables
const { env } = await import("./src/lib/env")

const siteURL = env.VERCEL ? `https://${env.VERCEL_URL}` : undefined

export default defineConfig({
  base: "/docs",
  cacheDir: ".astro/cache/astro",
  integrations: [mdx(), react()],
  prefetch: true,
  site: siteURL,
  vite: {
    cacheDir: ".astro/cache/vite",
    plugins: [tailwindcss()],
  },
})
