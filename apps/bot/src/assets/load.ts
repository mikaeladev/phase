import { isAbsolute, join } from "node:path"

export function loadAsset(path: string): Bun.BunFile {
  const absolutePath = isAbsolute(path) ? path : join(import.meta.dir, path)
  return Bun.file(absolutePath)
}
