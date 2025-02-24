import {
  ListIcon,
  PackageIcon,
  Settings2Icon,
  SquareChevronRightIcon,
} from "@repo/ui/lucide-icon"

import { absoluteURL } from "~/lib/utils"

export type NavItem = {
  label: string
  href: string
  icon?: React.JSX.Element
  category?: string
  external?: boolean
  disabled?: boolean
}

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
