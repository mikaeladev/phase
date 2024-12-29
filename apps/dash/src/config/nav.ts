import { absoluteURL } from "~/lib/utils"

import type { LucideIconName } from "@repo/ui/lucide-icon"
import type { SimpleIconName } from "@repo/ui/simple-icon"

type NavItemIcon =
  | {
      type: "lucide"
      name: LucideIconName
    }
  | {
      type: "simple"
      name: SimpleIconName
    }

export type NavItem = {
  label: string
  href: string
  icon?: NavItemIcon
  category?: string
  external?: boolean
  disabled?: boolean
}

export const dashboardPages: NavItem[] = [
  // pages
  {
    label: "Guilds",
    href: "/guilds",
    icon: {
      type: "lucide",
      name: "list",
    },
  },
  {
    label: "Modules",
    href: "/guilds/[id]/modules",
    icon: {
      type: "lucide",
      name: "package",
    },
  },
  {
    label: "Commands",
    href: "/guilds/[id]/commands",
    icon: {
      type: "lucide",
      name: "square-chevron-right",
    },
    disabled: true,
  },
  {
    label: "Settings",
    href: "/guilds/[id]/settings",
    icon: {
      type: "lucide",
      name: "settings-2",
    },
    disabled: true,
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
