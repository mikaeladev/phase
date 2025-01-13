import * as LabelPrimitive from "@radix-ui/react-label"
import { cn, cva } from "@repo/utils/site"

import type { VariantProps } from "@repo/utils/site"

export const labelVariants = cva(
  "text-sm leading-none font-semibold peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
)

export interface LabelProps
  extends React.ComponentPropsWithRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {}

export function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      className={cn(labelVariants(), className)}
      {...props}
    />
  )
}
