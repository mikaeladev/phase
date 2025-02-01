import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

// helpers

const baseMetadataSchema = z.object({ sidebarPriority: z.number() }).partial()

const baseSchema = z.object({
  title: z.string(),
  description: z.string(),
  metadata: z.optional(baseMetadataSchema),
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

const botModules = defineCollection({
  loader: generateLoader("bot/modules"),
  schema: baseSchema.extend({
    metadata: z.optional(
      baseMetadataSchema.extend({
        moduleId: z.string().nullable(),
      }),
    ),
  }),
})

const packages = defineCollection({
  loader: generateLoader("packages"),
  schema: baseSchema,
})

export const collections = { bot, botModules, packages }
