const distIndexData = [
  'import * as z from "./external"',
  'export * from "./external"',
  "export { z }",
  "export default z",
].join("\n")

const distTypesData = [
  'export * from "./index"',
  "export as namespace Zod",
].join("\n")

await Promise.all([
  Bun.write("dist/index.js", distIndexData),
  Bun.write("dist/index.d.ts", distIndexData),
  Bun.write("dist/types.d.ts", distTypesData),
])
