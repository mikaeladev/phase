import {
  ListIcon,
  PackageIcon,
  Settings2Icon,
  SquareChevronRightIcon,
} from "@repo/ui/lucide-icon"

import { absoluteURL } from "~/lib/utils"

import type { ExclusiveOr, Prettify, With } from "@repo/utils/types"

export type NavItem = Prettify<
  {
    label: string
    href: string
    external?: boolean
    disabled?: boolean
  } & ExclusiveOr<{ icon: React.JSX.Element }, { category: string }>
>

export const dashboardPages: NavItem[] = [
  // pages
  {
    label: "Guilds",
    href: "/guilds",
    icon: <ListIcon />,
  },
  {
    label: "Modules",
    href: "/guilds/[id]/modules",
    icon: <PackageIcon />,
  },
  {
    label: "Commands",
    href: "/guilds/[id]/commands",
    icon: <SquareChevronRightIcon />,
  },
  {
    label: "Settings",
    href: "/guilds/[id]/settings",
    icon: <Settings2Icon />,
  },
  // resources
  {
    label: "Documentation",
    href: absoluteURL("/docs", false),
    category: "Resources",
  },
  {
    label: "Support",
    href: absoluteURL("/redirect/discord", false),
    category: "Resources",
    external: true,
  },
  // other links
  {
    label: "Report a bug",
    href: absoluteURL("/contact/bug-report", false),
    category: "Other Links",
  },
  {
    label: "Make a suggestion",
    href: absoluteURL("/redirect/discord", false),
    category: "Other Links",
    external: true,
  },
  {
    label: "Gimme ur money",
    href: absoluteURL("/redirect/donate", false),
    category: "Other Links",
    external: true,
  },
]

export const dashboardPagesWithIcons = dashboardPages.filter(
  (item) => !!item.icon,
)

export const dashboardPagesByCategory = dashboardPages.reduce(
  (acc, item: NavItem) => {
    if (!item.category) return acc
    acc[item.category] ??= []
    acc[item.category]!.push(item)
    return acc
  },
  {} as Record<string, With<NavItem, "category">[]>,
)
