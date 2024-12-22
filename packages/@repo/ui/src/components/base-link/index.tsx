import { Slot } from "~/components/slot"

import { cn, cva } from "~/lib/utils"

import type { SlotProps } from "~/components/slot"
import type { VariantProps } from "class-variance-authority"

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
}

export function BaseLink({
  className,
  variant,
  size,
  label,
  external,
  ...props
}: BaseLinkProps) {
  return (
    <Slot
      title={label}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(baseLinkVariants({ variant, size, className }))}
      {...props}
    />
  )
}
