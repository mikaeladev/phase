import { getCollection as getContentCollection } from "astro:content"

import { ModuleId } from "@repo/utils/modules"

import type { CollectionEntry, CollectionKey } from "astro:content"

// collections //

export type AnyCollectionEntry = CollectionEntry<CollectionKey>

export async function getCollection<
  TName extends CollectionKey,
  TEntry extends CollectionEntry<TName>,
>(name: TName): Promise<TEntry[]> {
  const entries: TEntry[] = await getContentCollection(name)

  for (const entry of entries) {
    parseFrontmatterObject(entry.data)
  }

  return entries
}

// frontmatter variables //

const frontmatterVariableMap: Record<string, unknown> = {
  ModuleId,
}

function resolveFrontmatterVariable(variableName: string) {
  const keys = variableName.split(".")
  let value: unknown = frontmatterVariableMap

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key]
    } else {
      throw new Error(`Invalid frontmatter variable: ${variableName}`)
    }
  }

  if (typeof value === "string") return value
  throw new Error(`Invalid frontmatter variable: ${variableName}`)
}

function replaceFrontmatterVariables(value: string) {
  const frontmatterVariableRegex = /\$\{\{\s*([\w.]+)\s*\}\}/g // ${{ variable }}
  return value.replace(frontmatterVariableRegex, (_, variableName: string) => {
    return resolveFrontmatterVariable(variableName)
  })
}

function parseFrontmatterObject(data: Record<string, unknown>) {
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      data[key] = replaceFrontmatterVariables(value)
    } else if (typeof value === "object" && value !== null) {
      parseFrontmatterObject(value as Record<string, unknown>)
    }
  }

  return data
}
