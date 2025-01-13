import { cn, cva } from "@repo/utils/site"

import { Slot } from "~/components/slot"

import type { VariantProps } from "@repo/utils/site"
import type { SlotProps } from "~/components/slot"

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
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children">,
    Pick<SlotProps, "children"> {
  href: string
  label?: string
  external?: boolean
  mfe?: boolean
}

export function BaseLink({
  className,
  variant,
  size,
  label,
  external,
  mfe,
  ...props
}: BaseLinkProps) {
  return (
    <Slot
      title={label}
      aria-label={label}
      target={!mfe && external ? "_blank" : undefined}
      rel={!mfe && external ? "noreferrer" : undefined}
      className={cn(baseLinkVariants({ variant, size, className }))}
      {...props}
    />
  )
}
