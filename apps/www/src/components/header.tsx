import { Header as BaseHeader } from "@repo/ui/header"
import { Link } from "~/components/link"

import type { HeaderProps as BaseHeaderProps } from "@repo/ui/header"

export interface HeaderProps
  extends Omit<BaseHeaderProps, "link" | "position"> {}

export function Header(props: HeaderProps) {
  return <BaseHeader link={Link} position={"fixed"} {...props} />
}
