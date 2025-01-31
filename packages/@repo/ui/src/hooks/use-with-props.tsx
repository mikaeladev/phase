import type { FC } from "react"

export function useWithProps<
  TComponentProps extends object,
  TPredefinedProps extends Partial<TComponentProps>,
>(Component: FC<TComponentProps>, predefinedProps: TPredefinedProps) {
  const ComponentWithProps: FC<
    Omit<TComponentProps, keyof TPredefinedProps>
  > = (props) => (
    <Component
      {...(predefinedProps as unknown as TComponentProps)}
      {...props}
    />
  )

  ComponentWithProps.displayName =
    Component.displayName ?? Component.name ?? "AnonymousComponent"

  return ComponentWithProps
}
