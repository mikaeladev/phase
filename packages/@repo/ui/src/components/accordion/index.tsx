import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { cn } from "@repo/utils/site"

import { Button } from "~/components/button"
import { Icon } from "~/components/icon"
import { ChevronDownIcon } from "~/components/lucide-icon"

export type AccordionProps = React.ComponentPropsWithRef<
  typeof AccordionPrimitive.Root
>

export function Accordion({ className, ...props }: AccordionProps) {
  return <AccordionPrimitive.Root className={cn(className)} {...props} />
}

export interface AccordionItemProps
  extends React.ComponentPropsWithRef<typeof AccordionPrimitive.Item> {}

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  return (
    <AccordionPrimitive.Item className={cn("border-b", className)} {...props} />
  )
}

export interface AccordionTriggerProps
  extends React.ComponentPropsWithRef<typeof AccordionPrimitive.Trigger> {
  children: React.ReactNode
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <div
        className={cn(
          "relative flex flex-1 items-center justify-between py-1.5 text-sm font-medium underline-offset-2 transition-all hover:underline",
          className,
        )}
      >
        <AccordionPrimitive.Trigger
          className="focus-visible:ring-ring absolute top-0 left-0 h-full w-full focus-visible:ring-1 focus-visible:outline-hidden [&[data-state=open]~.chevron-icon>svg]:rotate-180"
          {...props}
        />
        {children}
        <AccordionPrimitive.Trigger asChild>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="text-muted-foreground hover:text-foreground chevron-icon relative"
          >
            <Icon
              icon={<ChevronDownIcon />}
              className="transition-transform duration-200"
            />
          </Button>
        </AccordionPrimitive.Trigger>
      </div>
    </AccordionPrimitive.Header>
  )
}

export interface AccordionContentProps
  extends React.ComponentPropsWithRef<typeof AccordionPrimitive.Content> {
  children: React.ReactNode
}

export function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  return (
    <AccordionPrimitive.Content
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}
