import { isValidElement } from "react"

import { cn, cva } from "@repo/utils/site"

import { Slot } from "~/components/slot"

import type { VariantProps } from "@repo/utils/site"

export const iconVariants = cva("pointer-events-none shrink-0", {
  variants: {
    size: {
      default: "size-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

type BaseIconProps = VariantProps<typeof iconVariants> &
  Omit<React.SVGProps<SVGSVGElement>, "children">

export interface IconPropsWithChildrenProp extends BaseIconProps {
  children: React.JSX.Element
  icon?: never
}

export interface IconPropsWithIconElementProp extends BaseIconProps {
  children?: never
  icon: React.JSX.Element
}

export interface IconPropsWithIconComponentProp extends BaseIconProps {
  children?: never
  icon: React.FC<React.SVGProps<SVGSVGElement>>
}

export type IconProps =
  | IconPropsWithChildrenProp
  | IconPropsWithIconElementProp
  | IconPropsWithIconComponentProp

/** Applies icon styles to its child element. */
export function Icon(props: IconPropsWithChildrenProp): React.JSX.Element

/**
 * Renders a given element with icon styles.
 *
 * @param props.icon - The icon element.
 */
export function Icon(props: IconPropsWithIconElementProp): React.JSX.Element

/**
 * Renders a given component with icon styles.
 *
 * @param props.icon - The icon component.
 */
export function Icon(props: IconPropsWithIconComponentProp): React.JSX.Element

export function Icon({ children, icon, size, className, ...props }: IconProps) {
  const isElement: (i: unknown) => i is React.JSX.Element = isValidElement

  const Comp =
    (children ?? isElement(icon))
      ? (Slot as React.FC<React.SVGProps<SVGSVGElement>>)
      : icon

  return (
    <Comp className={cn(iconVariants({ size }), className)} {...props}>
      {children ?? (isElement(icon) ? icon : null)}
    </Comp>
  )
}
