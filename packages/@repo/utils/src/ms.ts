import unsafeMs from "ms"

import type { StringValue } from "ms"

/**
 * The options to format with.
 */
export type MsOptions = { long: boolean }

/**
 * A safe version of `ms` that returns undefined if the value is invalid.
 *
 * @param value The value to parse.
 */
export function ms(value: string): number | undefined

/**
 * A safe version of `ms` that returns undefined if the value is invalid.
 *
 * @param value The value to format.
 * @param options The options to format with.
 */
export function ms(value: number, options?: MsOptions): string | undefined

export function ms(value: string | number, options?: MsOptions) {
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
