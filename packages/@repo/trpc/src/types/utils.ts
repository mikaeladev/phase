export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type UnionToIntersection<T> = Prettify<
  (T extends unknown ? (x: T) => unknown : never) extends (
    x: infer R,
  ) => unknown
    ? R
    : never
>

export type NullishPartial<T> = {
  [K in keyof T]?: T[K] | null
}
