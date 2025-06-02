import { errorUtil } from "../../../../../node_modules/zod/dist/esm/v3/helpers/errorUtil.js"
import {
  array,
  union,
  ZodString,
} from "../../../../../node_modules/zod/dist/esm/v3/types.js"

;(function patchZodString() {
  const proto = ZodString.prototype

  if (proto._patched) return

  proto.snowflake = function (message = "Invalid snowflake") {
    return this._addCheck({
      kind: "regex",
      regex: /^[0-9]{17,20}$/,
      ...errorUtil.errToObj(message),
    })
  }

  proto.mention = function (message = "Invalid mention") {
    return this._addCheck({
      kind: "regex",
      regex: /^<@&?[0-9]{17,20}>$|^@(?:everyone|here|\w+)$/,
      ...errorUtil.errToObj(message),
    })
  }

  proto.nonempty = function (message = "Required") {
    return this.trim().min(1, message)
  }

  proto._patched = true
})()

function unionFromArray(values) {
  if (values.length < 2) throw new Error("Array must have at least 2 items")
  return union(values)
}

function arrayFromUnion(values) {
  const union = unionFromArray(values)
  return array(union)
}

export * from "../../../../../node_modules/zod/dist/esm/v3/types.js"
export * from "../../../../../node_modules/zod/dist/esm/v3/errors.js"
export * from "../../../../../node_modules/zod/dist/esm/v3/helpers/errorUtil.js"
export * from "../../../../../node_modules/zod/dist/esm/v3/helpers/parseUtil.js"
export * from "../../../../../node_modules/zod/dist/esm/v3/helpers/typeAliases.js"
export * from "../../../../../node_modules/zod/dist/esm/v3/helpers/util.js"
export * from "../../../../../node_modules/zod/dist/esm/v3/ZodError.js"

export { unionFromArray, arrayFromUnion }
