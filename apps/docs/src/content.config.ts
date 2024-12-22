import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const docs = defineCollection({
  loader: glob({ pattern: "./**/*.{md,mdx}", base: "./src/content/" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
})

export const collections = { docs }
