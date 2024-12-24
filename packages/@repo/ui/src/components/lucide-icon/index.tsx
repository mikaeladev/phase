import { lazy } from "react"

import dynamicIcons from "lucide-react/dynamicIconImports.js"

import { cn } from "~/lib/utils"

import type { LucideProps } from "lucide-react"

export type LucideIconName = keyof typeof dynamicIcons

export interface LucideIconProps extends LucideProps {
  name: LucideIconName
}

export function LucideIcon({ name, className, ...props }: LucideIconProps) {
  const Icon = lazy(dynamicIcons[name])

  return (
    <Icon
      className={cn("pointer-events-none size-4 shrink-0", className)}
      {...props}
    />
  )
}
