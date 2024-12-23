export interface SidebarNavCategory {
  type: "category"
  label: string
  children: SidebarNavCategoryChild[]
}

export interface SidebarNavSubcategory {
  type: "subcategory"
  label: string
  children: SidebarNavPage[]
}

export interface SidebarNavPage {
  type: "page"
  label: string
  href: string
}

export type SidebarNavCategoryChild = SidebarNavSubcategory | SidebarNavPage

export type SidebarNavItems = SidebarNavCategory[]
