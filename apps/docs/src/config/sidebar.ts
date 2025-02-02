import { getCollection } from "~/lib/content"

import type { AnyCollectionEntry } from "~/lib/content"
import type {
  SidebarNavCategoryChild,
  SidebarNavItems,
  SidebarNavPage,
} from "~/types/sidebar"

function parseEntries(entries: AnyCollectionEntry[]) {
  const pageEntries: AnyCollectionEntry[] = []

  const subcategoryMap = entries.reduce(
    (acc, entry) => {
      const parts = entry.id.split("/")
      const key = parts.length > 1 ? parts[0] : null

      if (!key) {
        pageEntries.push(entry)
        return acc
      }

      if (!acc[key]) acc[key] = []
      acc[key].push(entry)

      return acc
    },
    {} as Record<string, AnyCollectionEntry[]>,
  )

  const compareEntries = (a: AnyCollectionEntry, b: AnyCollectionEntry) =>
    (a.data.metadata?.sidebarPriority ?? Infinity) -
    (b.data.metadata?.sidebarPriority ?? Infinity)

  const createChild = (entry: AnyCollectionEntry): SidebarNavPage => ({
    type: "page" as const,
    label: entry.data.title,
    href: `/docs/${entry.collection}${entry.id === "/" ? "" : `/${entry.id}`}`,
  })

  const children: SidebarNavCategoryChild[] = [
    ...pageEntries.sort(compareEntries).map(createChild),
    ...Object.entries(subcategoryMap).map(([key, entries]) => ({
      type: "subcategory" as const,
      label: key
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
      children: entries.sort(compareEntries).map(createChild),
    })),
  ]

  return children
}

export async function getSidebarNavItems(): Promise<SidebarNavItems> {
  const botEntries = await getCollection("bot")
  const packageEntries = await getCollection("packages")

  return [
    {
      type: "category",
      label: "Getting Started",
      children: [
        {
          type: "page",
          label: "Introduction",
          href: "/docs",
        },
        {
          type: "page",
          label: "Terms of Service",
          href: "/docs/terms",
        },
        {
          type: "page",
          label: "Privacy Policy",
          href: "/docs/privacy",
        },
      ],
    },
    {
      type: "category",
      label: "Discord Bot",
      children: parseEntries(botEntries),
    },
    {
      type: "category",
      label: "Packages",
      children: parseEntries(packageEntries),
    },
  ]
}
