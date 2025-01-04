import { Slot } from "~/components/slot"

import { cn } from "~/lib/utils"

import type { SlotProps } from "~/components/slot"
import type { ExclusiveOr, Prettify } from "~/types/utils"

export type IconProps = Prettify<
  Omit<SlotProps, "children"> &
    Omit<React.ComponentPropsWithoutRef<"svg">, `on${string}` | "children"> &
    ExclusiveOr<{ icon: React.JSX.Element }, { children: React.JSX.Element }>
>

export function Icon({ children, icon, className, ...props }: IconProps) {
  return (
    <Slot
      className={cn("pointer-events-none size-4 shrink-0", className)}
      {...props}
    >
      {icon ?? children}
    </Slot>
  )
}
