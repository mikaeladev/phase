import { getCollection } from "astro:content"

import type {
  SidebarNavCategoryChild,
  SidebarNavItems,
  SidebarNavPage,
} from "~/types/sidebar"
import type { AnyEntryMap } from "astro:content"

type Entry = AnyEntryMap[keyof AnyEntryMap][string]

function parseEntries(entries: Entry[]) {
  const pageEntries: Entry[] = []

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
    {} as Record<string, Entry[]>,
  )

  const compareEntries = (a: Entry, b: Entry) =>
    (a.data.navOptions?.priority ?? 0) - (b.data.navOptions?.priority ?? 0)

  const createChild = (entry: Entry): SidebarNavPage => ({
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
      label: "Welcome",
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
