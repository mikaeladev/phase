import { getCollection } from "astro:content"

import type { SidebarNavItem } from "~/types/sidebar"

export async function getSidebarNavItems(): Promise<SidebarNavItem[]> {
  const docsPages = await getCollection("docs")

  return [
    {
      type: "category",
      label: "Getting Started",
      children: [
        {
          type: "page",
          label: "Introduction",
          href: "/docs/",
        },
        ...docsPages.map((page) => ({
          type: "page" as const,
          label: page.data.title,
          href: `/docs/${page.id}/`,
        })),
      ],
    },
  ]
}
