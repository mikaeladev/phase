import { array, union, ZodString } from "./lib"
import { errToObj } from "./utils"

import type { ZodTypeAny } from "./lib"

// custom ZodString methods

ZodString.prototype.snowflake = function (message = "Invalid snowflake") {
  return this._addCheck({
    kind: "regex",
    regex: /^[0-9]{17,20}$/,
    ...errToObj(message),
  })
}

ZodString.prototype.mention = function (message = "Invalid mention") {
  return this._addCheck({
    kind: "regex",
    regex: /^<@&?[0-9]{17,20}>$|^@(?:everyone|here|\w+)$/,
    ...errToObj(message),
  })
}

ZodString.prototype.nonempty = function (message = "Required") {
  return this.trim().min(1, message)
}

// custom utils

export function unionFromArray<T extends ZodTypeAny>(values: T[]) {
  if (values.length < 2) throw new Error("Array must have at least 2 items")
  return union(values as [T, T, ...T[]])
}

export function arrayFromUnion<T extends ZodTypeAny>(values: T[]) {
  const union = unionFromArray(values)
  return array(union)
}
