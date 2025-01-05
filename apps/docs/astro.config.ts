import "./src/env"

import { defineConfig } from "astro/config"

import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import tailwind from "@astrojs/tailwind"

export default defineConfig({
  base: "/docs",
  cacheDir: ".astro/cache/astro",
  integrations: [react(), tailwind({ applyBaseStyles: false }), mdx()],
  prefetch: true,
  vite: { cacheDir: ".astro/cache/vite" },
})
