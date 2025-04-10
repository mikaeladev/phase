import unsafeMs from "ms"

import type { StringValue } from "ms"

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

/** `Object.keys` but with better typing. */
export function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}

/** `Object.entries` but with better typing. */
export function entries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}

export function deleteKeyRecursively<TObj, TKey extends string>(
  obj: TObj,
  keyToDelete: TKey,
): Omit<TObj, TKey> {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  typeof obj === "object" &&
    obj !== null &&
    (Array.isArray(obj)
      ? obj.forEach((item) => deleteKeyRecursively(item, keyToDelete))
      : Object.entries(obj).forEach(([key, value]) =>
          key === keyToDelete
            ? delete obj[key as keyof typeof obj]
            : deleteKeyRecursively(value, keyToDelete),
        ))

  return obj as Omit<TObj, TKey>
}

/**
 * Exploits a long-lasting bug in Discord where the content of a message is hidden if it's preceded by a bunch of pipe characters. Useful for hiding metadata in messages.
 *
 * @param content The content to hide.
 * @throws If the message exceeds 997 characters due to Discord's message length limit.
 */
export function createHiddenContent(content: string) {
  const glitchedPipes =
    "||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| _ _ _ _ _ _ "

  const maximumLength = 2000
  const messageLength = glitchedPipes.length + content.length

  if (messageLength > maximumLength) {
    throw new Error(
      `Message length exceeds maximum length of ${maximumLength} characters.`,
    )
  }

  return glitchedPipes + content
}

/**
 * Parses a message that was hidden using `createHiddenContent`.
 *
 * @param content The content to parse.

 */
export function parseHiddenContent(content: string) {
  const glitchedPipes =
    "||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​|| _ _ _ _ _ _ "

  if (!content.includes(glitchedPipes)) {
    return null
  }

  const hiddenContent = content.split(glitchedPipes)[1]!
  return hiddenContent
}

/**
 * The options to format with.
 */
export type MsOptions = { long: boolean }

/**
 * A safe version of `ms` that returns undefined if the value is invalid.
 *
 * @param value The value to parse.
 */
export function safeMs(value: string): number | undefined

/**
 * A safe version of `ms` that returns undefined if the value is invalid.
 *
 * @param value The value to format.
 * @param options The options to format with.
 */
export function safeMs(value: number, options?: MsOptions): string | undefined

export function safeMs(value: string | number, options?: MsOptions) {
  let parsedValue: number | string | undefined

  try {
    if (typeof value === "string") {
      parsedValue = unsafeMs(value as StringValue)
    } else {
      parsedValue = unsafeMs(value, options)
    }
  } catch {
    parsedValue = undefined
  }

  return parsedValue
}
