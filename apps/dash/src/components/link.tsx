"use client"

import NextLink from "next/link"

import { BaseLink, baseLinkVariants } from "@repo/ui/base-link"

import type { BaseLinkProps } from "@repo/ui/base-link"

export const linkVariants = baseLinkVariants

export interface LinkProps extends Omit<BaseLinkProps, "anchor"> {}

export function Link({ href, ...props }: LinkProps) {
  const Anchor =
    props.disabled || (!props.mfe && props.external)
      ? "a"
      : (NextLink as BaseLinkProps["anchor"])

  return (
    <BaseLink anchor={Anchor} href={props.disabled ? "#" : href} {...props} />
  )
}
