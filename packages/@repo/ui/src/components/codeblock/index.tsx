import { cn, cva } from "@repo/utils/site"

import type { VariantProps } from "@repo/utils/site"

export const codeblockVariants = cva(
  "text-foreground bg-muted/50 border font-mono text-sm",
  {
    variants: {
      inline: {
        true: "mx-[0.25ch] inline-block rounded-[4px] px-1",
        false: "my-1 rounded px-3 py-2",
      },
    },
    defaultVariants: {
      inline: false,
    },
  },
)

export interface CodeblockProps
  extends React.ComponentPropsWithRef<"pre">,
    VariantProps<typeof codeblockVariants> {}

export function Codeblock({
  className,
  children,
  inline,
  ...props
}: CodeblockProps) {
  const Component = inline ? "span" : "pre"

  return (
    <Component
      className={cn(codeblockVariants({ inline }), className)}
      {...props}
    >
      <code>{children}</code>
    </Component>
  )
}
