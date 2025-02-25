import { file } from "bun"

import { parse } from "yaml"

import type { BunPlugin } from "bun"

export const yamlLoader: BunPlugin = {
  name: "YAML Loader",
  setup(build) {
    build.onLoad({ filter: /\.ya?ml$/ }, async (args) => {
      const content = await file(args.path).text()
      const exports = parse(content) as Record<string, unknown>

      return { exports: { default: exports, ...exports }, loader: "object" }
    })
  },
}
