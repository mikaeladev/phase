export type SidebarNavItem =
  | {
      type: "category"
      label: string
      children: SidebarNavItem[]
    }
  | {
      type: "page"
      label: string
      href: string
    }
