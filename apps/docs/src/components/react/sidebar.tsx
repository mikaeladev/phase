import { useState } from "react"

import { Icon } from "@repo/ui/icon"
import { ChevronRightIcon } from "@repo/ui/lucide-icon"
import { ScrollArea } from "@repo/ui/scroll-area"
import { Link } from "~/components/react/link"

import type {
  SidebarNavItems,
  SidebarNavPage,
  SidebarNavSubcategory,
} from "~/types/sidebar"

interface SidebarProps {
  pathname: string
  items: SidebarNavItems
}

export function Sidebar(props: SidebarProps) {
  return (
    <ScrollArea>
      {props.items.map((category) => (
        <div key={category.label} className="mb-6 px-2">
          <h4 className="text-sm font-semibold leading-6">{category.label}</h4>
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
                <li
                  key={child.href}
                  className="group"
                  data-active={props.pathname === child.href}
                >
                  <SidebarLink {...child} />
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </ScrollArea>
  )
}

interface SidebarSubcategoryProps {
  pathname: string
  subcategory: SidebarNavSubcategory
  children: React.ReactNode
}

function SidebarSubcategory(props: SidebarSubcategoryProps) {
  const startExpanded = props.subcategory.children.some(
    (child) => child.href === props.pathname,
  )

  const [expanded, setExpanded] = useState(startExpanded)

  return (
    <li className="group" aria-expanded={expanded}>
      <button
        className="flex items-center gap-2"
        onClick={() => setExpanded(!expanded)}
      >
        <h5 className="text-muted-foreground hover:text-foreground text-sm transition-colors">
          {props.subcategory.label}
        </h5>
        <Icon
          icon={<ChevronRightIcon />}
          className="opacity-75 transition-transform group-aria-expanded:rotate-90"
        />
      </button>
      <ul className="border-muted-foreground/25 my-2 ml-1 hidden flex-col border-l pl-3 group-aria-expanded:flex">
        {props.children}
      </ul>
    </li>
  )
}

function SidebarLink(props: SidebarNavPage) {
  return (
    <Link
      href={props.href}
      label={props.label}
      variant={"hover"}
      className="group-data-[active='true']:text-foreground text-sm"
    >
      {props.label}
    </Link>
  )
}
