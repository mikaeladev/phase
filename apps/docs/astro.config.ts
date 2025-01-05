import { defineConfig } from "astro/config"
import { loadEnv } from "vite"

import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import tailwind from "@astrojs/tailwind"

// loads environment variables
process.env = loadEnv(process.env.NODE_ENV!, process.cwd(), "")

// validates environment variables
await import("./src/lib/env")

export default defineConfig({
  base: "/docs",
  cacheDir: ".astro/cache/astro",
  integrations: [react(), tailwind({ applyBaseStyles: false }), mdx()],
  prefetch: true,
  vite: { cacheDir: ".astro/cache/vite" },
})
