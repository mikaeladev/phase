import type { ErrMessage } from "./utils"

export * from "../../../../node_modules/zod/lib/errors"
export * from "../../../../node_modules/zod/lib/helpers/parseUtil"
export * from "../../../../node_modules/zod/lib/helpers/typeAliases"
export * from "../../../../node_modules/zod/lib/helpers/util"
export * from "../../../../node_modules/zod/lib/types"
export * from "../../../../node_modules/zod/lib/ZodError"

declare module "../../../../node_modules/zod/lib/types" {
  interface ZodString {
    snowflake(message?: ErrMessage): ZodString
    mention(message?: ErrMessage): ZodString
    nonempty(message?: ErrMessage): ZodString
  }
}
