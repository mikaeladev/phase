export { cn, cva, absoluteURL, type VariantProps } from "@repo/utils/site"

export const getOrdinal = (number: number): string => {
  if (number >= 11 && number <= 13) return number + "th"
  return (
    number +
    (["th", "st", "nd", "rd"][number % 10] ?? ["th", "st", "nd", "rd"][0]!)
  )
}

/** Prevents default browser behaviour. */
export function preventDefault(event: { preventDefault: () => void }) {
  event.preventDefault()
}

export type Keys<T extends object> = (keyof T)[]

export function keys<T extends object>(obj: T) {
  return Object.keys(obj) as Keys<T>
}

export type Entries<T extends object> = Required<{
  [K in keyof T]: [K, Required<T>[K]]
}>[keyof T][]

export function entries<T extends object>(obj: T) {
  return Object.entries(obj) as Entries<T>
}
