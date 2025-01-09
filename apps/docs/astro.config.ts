import { defineConfig } from "astro/config"
import { loadEnv } from "vite"

import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import tailwind from "@astrojs/tailwind"

// loads environment variables
process.env = loadEnv(process.env.NODE_ENV!, process.cwd(), "")

// validates environment variables
const { env } = await import("./src/lib/env")

export default defineConfig({
  // site stuff
  site: env.VERCEL ? `https://${env.VERCEL_URL}` : undefined,
  // astro stuff
  prefetch: true,
  integrations: [mdx(), react(), tailwind({ applyBaseStyles: false })],
  // cache stuff
  cacheDir: ".astro/cache/astro",
  vite: { cacheDir: ".astro/cache/vite" },
})
