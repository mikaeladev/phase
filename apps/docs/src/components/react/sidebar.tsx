import { Icon } from "@repo/ui/icon"
import { ChevronRightIcon } from "@repo/ui/lucide-icon"
import { ScrollArea } from "@repo/ui/scroll-area"
import { Link } from "~/components/react/link"

import type {
  SidebarNavItems,
  SidebarNavPage,
  SidebarNavSubcategory,
} from "~/types/sidebar"

// sidebar //

interface SidebarProps {
  pathname: string
  items: SidebarNavItems
}

export function Sidebar(props: SidebarProps) {
  return (
    <ScrollArea>
      <nav className="space-y-6">
        {props.items.map((category) => (
          <div key={category.label} className="px-2">
            <h4 className="text-sm font-semibold leading-6">
              {category.label}
            </h4>
            <ul className="mt-1 flex flex-col space-y-2">
              {category.children.map(function mapChild(child) {
                return child.type === "subcategory" ? (
                  <SidebarSubcategory
                    key={child.label}
                    pathname={props.pathname}
                    subcategory={child}
                  >
                    {child.children.map(mapChild)}
                  </SidebarSubcategory>
                ) : (
                  <SidebarLink
                    key={child.href}
                    pathname={props.pathname}
                    page={child}
                  />
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </ScrollArea>
  )
}

// sidebar subcategory //

interface SidebarSubcategoryProps {
  pathname: string
  subcategory: SidebarNavSubcategory
  children: React.ReactNode
}

function SidebarSubcategory(props: SidebarSubcategoryProps) {
  const startExpanded = props.subcategory.children.some(
    (child) => child.href === props.pathname,
  )

  return (
    <li>
      <details className="group" open={startExpanded}>
        <summary className="flex cursor-pointer items-center gap-2">
          <span className="text-muted-foreground hover:text-foreground text-sm transition-colors">
            {props.subcategory.label}
          </span>
          <Icon
            icon={<ChevronRightIcon />}
            className="opacity-75 transition-transform group-open:rotate-90"
          />
        </summary>
        <ul className="border-muted-foreground/25 my-2 ml-1 flex flex-col border-l pl-3">
          {props.children}
        </ul>
      </details>
    </li>
  )
}

// sidebar link //

interface SidebarLinkProps {
  pathname: string
  page: SidebarNavPage
}

function SidebarLink(props: SidebarLinkProps) {
  return (
    <li
      key={props.page.href}
      className="group"
      data-active={props.pathname === props.page.href}
    >
      <Link
        href={props.page.href}
        label={props.page.label}
        variant={"hover"}
        className="group-data-[active='true']:text-foreground text-sm"
      >
        {props.page.label}
      </Link>
    </li>
  )
}
