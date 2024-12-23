import { defineConfig } from "astro/config"

import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import tailwind from "@astrojs/tailwind"

export default defineConfig({
  integrations: [react(), tailwind({ applyBaseStyles: false }), mdx()],
  prefetch: true,
  base: "/docs",
})
