import { cn, cva } from "@repo/utils/site"

import type { VariantProps } from "@repo/utils/site"

export const baseLinkVariants = cva("underline-offset-2 transition-colors", {
  variants: {
    variant: {
      default: "text-foreground underline",
      hover:
        "text-muted-foreground hover:text-primary aria-selected:text-primary hover:underline",
      "no-underline": "no-underline",
    },
    size: {
      base: "text-base",
      sm: "text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface BaseLinkProps
  extends VariantProps<typeof baseLinkVariants>,
    React.ComponentPropsWithRef<"a"> {
  anchor: React.ElementType<{ href?: string }, "a">
  href: string
  label?: string
  disabled?: boolean
  external?: boolean
  mfe?: boolean
}

export function BaseLink({
  anchor: Anchor,
  className,
  variant,
  size,
  label,
  external,
  mfe,
  ...props
}: BaseLinkProps) {
  const isExternal = !mfe && external

  return (
    <Anchor
      title={label}
      aria-label={label}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className={cn(baseLinkVariants({ variant, size, className }))}
      {...props}
    />
  )
}
