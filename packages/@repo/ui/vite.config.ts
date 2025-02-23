import fs from "node:fs/promises"
import path from "path"

import { defineConfig } from "vite"

import reactPlugin from "@vitejs/plugin-react"
import { default as glob } from "fast-glob"
import { default as prettier } from "prettier"
import preserveDirectivesPlugin from "rollup-preserve-directives"
import dtsPlugin from "vite-plugin-dts"
import tsconfigPathsPlugin from "vite-tsconfig-paths"

type ExportsField = Record<
  string,
  { types: string; import: string; require: string } | string
>

const entries = Object.fromEntries(
  glob.sync("src/components/*/index.tsx").map((file) => {
    const name = file.split("/").slice(-2, -1)[0]
    return [name, path.resolve(__dirname, file)]
  }),
) as Record<string, string>

const externals = [
  "@repo/config",
  "@repo/utils",
  "@icons-pack/react-simple-icons",
  "cmdk",
  "lucide-react",
  "react",
]

export default defineConfig({
  build: {
    lib: {
      name: "PhaseUI",
      formats: ["es"],
      entry: entries,
    },
    rollupOptions: {
      external: (id) =>
        externals.includes(id) ||
        externals.some((external) => id.startsWith(external + "/")),
      output: {
        dir: "dist",
        entryFileNames: "components/[name]/index.js",
        chunkFileNames: "chunks/[name]-[hash].js",
        globals: { react: "React" },
      },
    },
  },
  plugins: [
    reactPlugin(),
    preserveDirectivesPlugin(),
    tsconfigPathsPlugin(),
    dtsPlugin({
      include: [
        "src/components/*/index.tsx",
        "src/types/declarations/**/*.d.ts",
        "src/types/utils.ts",
      ],
    }),
    {
      name: "post-build",
      apply: "build",
      async closeBundle() {
        const packageJsonPath = path.resolve("./package.json")

        const packageJson = JSON.parse(
          await fs.readFile(packageJsonPath, "utf-8"),
        ) as Record<"exports", ExportsField>

        packageJson.exports = Object.keys(entries).reduce<ExportsField>(
          (acc, key) => {
            acc[`./${key}`] = {
              types: `./dist/components/${key}/index.d.ts`,
              import: `./dist/components/${key}/index.js`,
              require: `./dist/components/${key}/index.js`,
            }
            return acc
          },
          {},
        )

        const packageJsonData = await prettier.format(
          JSON.stringify(packageJson, null, 2),
          { parser: "json" },
        )

        await fs.writeFile(packageJsonPath, packageJsonData)
      },
    },
  ],
})
