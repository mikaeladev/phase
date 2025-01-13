import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./src/site.ts", "./src/modules/index.ts"],
  format: ["esm"],
  clean: true,
  dts: true,
  minify: true,
  splitting: false,
  sourcemap: true,
})
