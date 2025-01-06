export type UnionToIntersection<U> = (
  U extends unknown ? (arg: U) => void : never
) extends (arg: infer I) => void
  ? I
  : never

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
