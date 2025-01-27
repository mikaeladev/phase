import { z } from "zod"

// error utils

export type ErrMessage = string | { message?: string }

export const errToObj = (message?: ErrMessage) =>
  typeof message === "string" ? { message } : (message ?? {})

export const errToStr = (message?: ErrMessage): string | undefined =>
  typeof message === "string" ? message : message?.message

// custom zod types

declare module "zod" {
  interface ZodString {
    snowflake(message?: ErrMessage): ZodString
    mention(message?: ErrMessage): ZodString
    nonempty(message?: ErrMessage): ZodString
  }
}

z.ZodString.prototype.snowflake = function (message = "Invalid snowflake") {
  return this._addCheck({
    kind: "regex",
    regex: /^[0-9]{17,20}$/,
    ...errToObj(message),
  })
}

z.ZodString.prototype.mention = function (message = "Invalid mention") {
  return this._addCheck({
    kind: "regex",
    regex: /^<@&?[0-9]{17,20}>$|^@(?:everyone|here|\w+)$/,
    ...errToObj(message),
  })
}

z.ZodString.prototype.nonempty = function (message = "Required") {
  return this.trim().min(1, message)
}

export { z }
