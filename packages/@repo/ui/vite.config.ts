import fs from "node:fs/promises"
import path from "path"

import reactPlugin from "@vitejs/plugin-react"
import glob from "fast-glob"
import prettier from "prettier"
import preserveDirectivesPlugin from "rollup-preserve-directives"
import { defineConfig } from "vite"
import dtsPlugin from "vite-plugin-dts"
import tsconfigPathsPlugin from "vite-tsconfig-paths"

type ExportsField = Record<
  string,
  { types: string; import: string; require: string } | string
>

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const entries: Record<string, string> = Object.fromEntries(
  glob.sync("src/components/*/index.tsx").map((file) => {
    const name = file.split("/").slice(-2, -1)[0]
    return [name, path.resolve(__dirname, file)]
  }),
)

export default defineConfig({
  build: {
    lib: {
      name: "PhaseUI",
      formats: ["es"],
      entry: entries,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        dir: "dist",
        entryFileNames: "components/[name]/index.js",
        chunkFileNames: "chunks/[name]-[hash].js",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
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
