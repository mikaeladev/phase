import { cn, cva } from "~/lib/utils"

import type { VariantProps } from "class-variance-authority"

export const badgeVariants = cva(
  "focus:ring-ring inline-flex items-center rounded-[4px] border px-1.5 py-0.5 text-xs font-semibold transition-colors focus:ring-1 focus:ring-offset-1 focus:outline-hidden focus-visible:outline-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-transparent shadow-sm",
        secondary: "bg-secondary text-secondary-foreground border-transparent",
        destructive:
          "bg-destructive text-destructive-foreground border-transparent shadow-sm",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}
