import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { Icon } from "~/components/icon"
import { CheckIcon } from "~/components/lucide-icon"

import { cn } from "~/lib/utils"

export interface CheckboxProps
  extends React.ComponentPropsWithRef<typeof CheckboxPrimitive.Root> {}

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "border-primary focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground peer h-4 w-4 shrink-0 rounded-sm border shadow-sm focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Icon icon={<CheckIcon />} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
