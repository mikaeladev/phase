import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

// helpers

const baseSchema = z.object({
  title: z.string(),
  description: z.string(),
  navOptions: z.object({ priority: z.number() }).partial().optional(),
})

function generateLoader(dir: string) {
  return glob({
    pattern: "**/!(_)*.mdx",
    base: `./src/content/${dir}/`,
    generateId(options) {
      return options.entry.replace(".mdx", "").replace(/(^|\/)index\b/g, "/")
    },
  })
}

// collections

const bot = defineCollection({
  loader: generateLoader("bot"),
  schema: baseSchema,
})

const packages = defineCollection({
  loader: generateLoader("packages"),
  schema: baseSchema,
})

export const collections = { bot, packages }
