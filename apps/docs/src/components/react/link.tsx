import { BaseLink, baseLinkVariants } from "@repo/ui/base-link"

import type { BaseLinkProps } from "@repo/ui/base-link"

export const linkVariants = baseLinkVariants

export interface LinkProps extends Omit<BaseLinkProps, "anchor"> {}

export function Link({ href, ...props }: LinkProps) {
  return (
    <BaseLink
      anchor={"a"}
      href={props.disabled ? "#" : href}
      data-astro-prefetch={!props.mfe && !props.external}
      {...props}
    />
  )
}
