import type { errorUtil } from "../../../../../node_modules/zod/dist/types/v3/helpers/errorUtil.d.ts"
import type {
  ZodArray,
  ZodTypeAny,
  ZodUnion,
} from "../../../../../node_modules/zod/dist/types/v3/types.d.ts"

declare module "../../../../../node_modules/zod/dist/types/v3/types.d.ts" {
  interface ZodString {
    snowflake(message?: errorUtil.ErrMessage): ZodString
    mention(message?: errorUtil.ErrMessage): ZodString
    nonempty(message?: errorUtil.ErrMessage): ZodString
  }
}

declare function unionFromArray<T extends ZodTypeAny>(
  values: T[],
): ZodUnion<[T, T, ...T[]]>

declare function arrayFromUnion<T extends ZodTypeAny>(
  values: T[],
): ZodArray<ZodUnion<[T, T, ...T[]]>, "many">

export * from "../../../../../node_modules/zod/dist/types/v3/types.d.ts"
export * from "../../../../../node_modules/zod/dist/types/v3/errors.d.ts"
export * from "../../../../../node_modules/zod/dist/types/v3/helpers/errorUtil.d.ts"
export * from "../../../../../node_modules/zod/dist/types/v3/helpers/parseUtil.d.ts"
export * from "../../../../../node_modules/zod/dist/types/v3/helpers/typeAliases.d.ts"
export * from "../../../../../node_modules/zod/dist/types/v3/helpers/util.d.ts"
export * from "../../../../../node_modules/zod/dist/types/v3/ZodError.d.ts"

export { unionFromArray, arrayFromUnion }
