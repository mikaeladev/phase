import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm"],
  clean: true,
  dts: true,
  minify: true,
  splitting: false,
  sourcemap: true,
})
