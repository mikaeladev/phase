import type { TupleOf } from "@repo/utils/types"

export function isLength<TArrayValue, TLength extends number>(
  array: TArrayValue[],
  length: TLength,
): array is TupleOf<TArrayValue, TLength> {
  return array.length === length
}
