"use client"

import NextLink from "next/link"

import { BaseLink, baseLinkVariants } from "@repo/ui/base-link"

import type { BaseLinkProps } from "@repo/ui/base-link"

export const linkVariants = baseLinkVariants

export interface LinkProps extends BaseLinkProps {
  disabled?: boolean
}

export function Link({
  disabled,
  children,
  href,
  external,
  mfe,
  ...props
}: LinkProps) {
  const Comp = disabled ? "span" : !mfe && !external ? "a" : NextLink

  return (
    <BaseLink href={href} external={external} mfe={mfe} {...props}>
      <Comp href={href}>{children}</Comp>
    </BaseLink>
  )
}
