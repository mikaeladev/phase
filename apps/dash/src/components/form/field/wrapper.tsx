import { cn, cva } from "~/lib/utils"

import type { VariantProps } from "~/lib/utils"

const wrapperVariants = cva("", {
  variants: {
    type: {
      default: "space-y-6",
      array: "space-y-4",
    },
  },
  defaultVariants: {
    type: "default",
  },
})

export interface FormFieldWrapperProps
  extends VariantProps<typeof wrapperVariants>,
    React.ComponentPropsWithRef<"div"> {}

export function FormFieldWrapper({
  className,
  type,
  ...props
}: FormFieldWrapperProps) {
  return <div className={cn(wrapperVariants({ type }), className)} {...props} />
}
