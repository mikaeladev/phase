import { DiscordIcon, GithubIcon } from "@repo/ui/simple-icon"

export type NavItem = {
  label: string
  href: string
  icon?: React.JSX.Element
  category?: string
  external?: boolean
  disabled?: boolean
}

export const mainPages: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Docs",
    href: "/docs",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Invite",
    href: "/redirect/invite",
    external: true,
  },
  // icons
  {
    label: "GitHub",
    href: "/redirect/github",
    icon: <GithubIcon />,
    external: true,
  },
  {
    label: "Discord",
    href: "/redirect/discord",
    icon: <DiscordIcon />,
    external: true,
  },
]

export const docsPages: NavItem[] = [
  {
    label: "Introduction",
    href: "/docs",
    category: "Getting Started",
  },
  {
    label: "Changelog",
    href: "/docs/changelog",
    category: "Getting Started",
  },
  {
    label: "Terms",
    href: "/docs/terms",
    category: "Getting Started",
  },
  {
    label: "Privacy",
    href: "/docs/privacy",
    category: "Getting Started",
  },
  // modules
  {
    label: "Counters",
    href: "/docs/modules/counters",
    category: "Modules",
  },
  {
    label: "Welcome Messages",
    href: "/docs/modules/welcome-messages",
    category: "Modules",
  },
]

export const splitPagesByCategory = (
  pages: NavItem[],
): Record<string, NavItem[]> => {
  return pages.reduce(
    (acc, page) => {
      const category = page.category ?? "Misc"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(page)
      return acc
    },
    {} as Record<string, NavItem[]>,
  )
}
