// unions //

export type Arrayable<T> = T | T[]
export type Awaitable<T> = T | Promise<T>
export type Optional<T> = T | undefined
export type Nullable<T> = T | null

export type UnionToIntersection<T> = (
  T extends unknown ? (x: T) => unknown : never
) extends (x: infer R) => unknown
  ? R
  : never

// objects //

export type Prettify<T extends object> = {
  [K in keyof T]: T[K]
} & {}

export type Mutable<T extends object> = {
  -readonly [K in keyof T]: T[K]
}

export type With<T extends object, K extends keyof T> = Prettify<
  Omit<T, K> & Required<Pick<T, K>>
>

export type Without<T extends object, U extends object> = Partial<
  Record<Exclude<keyof T, keyof U>, never>
>

export type ExclusiveOr<T extends object, U extends object> =
  | (Without<T, U> & U)
  | (Without<U, T> & T)

export type NullishPartial<T> = {
  [K in keyof T]?: T[K] | null
}

// arrays //

export type TupleOf<
  T,
  N extends number,
  R extends T[] = [],
> = R["length"] extends N ? R : TupleOf<T, N, [T, ...R]>

export type ValueOf<T extends object | Array<unknown>> =
  T extends Array<infer U> ? U : T[keyof T]
