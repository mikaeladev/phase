import { cn } from "@repo/utils/site"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-secondary/50 animate-pulse rounded-md border",
        className,
      )}
      {...props}
    />
  )
}
