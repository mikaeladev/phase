import { defineConfig } from "astro/config"
import { loadEnv } from "vite"

import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import { siteConfig } from "@repo/config/site"
import tailwindcss from "@tailwindcss/vite"

// loads environment variables
process.env = loadEnv(process.env.NODE_ENV!, process.cwd(), "")

// validates environment variables
await import("./src/lib/env")

export default defineConfig({
  base: siteConfig.basePath,
  cacheDir: ".astro/cache/astro",
  integrations: [mdx(), react(), sitemap()],
  prefetch: true,
  site: siteConfig.url,
  server: {
    port: siteConfig.port,
  },
  vite: {
    cacheDir: ".astro/cache/vite",
    plugins: [tailwindcss()],
  },
})
