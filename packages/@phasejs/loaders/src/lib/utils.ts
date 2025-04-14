import { join } from "node:path"

import type { AppConfig } from "~/types/app"

export function resolveRootDir(config: AppConfig) {
  return join(process.cwd(), config.rootDir ?? "src")
}

export function regexFilter(pattern: string) {
  return (path: string) => new RegExp(pattern).test(path)
}

export async function loadFile(filePath: string, config: AppConfig) {
  const basePath = resolveRootDir(config)
  const fullPath = join(basePath, filePath)
  return (await import(fullPath)) as Record<string, unknown>
}
