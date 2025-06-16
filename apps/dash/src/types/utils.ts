export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type Optional<T> = T | undefined

export type Arrayable<
  TValue,
  TArray extends boolean = boolean,
> = TArray extends true ? TValue[] : TValue

export type PascalToKebab<
  T extends string,
  Accumulator extends string = "",
> = T extends `${infer First}${infer Rest}`
  ? First extends Uppercase<First>
    ? PascalToKebab<
        Rest,
        `${Accumulator}${Accumulator extends "" ? "" : "-"}${Lowercase<First>}`
      >
    : PascalToKebab<Rest, `${Accumulator}${First}`>
  : Accumulator

export type With<T, K extends keyof T> = Prettify<
  Omit<T, K> & Required<Pick<T, K>>
>

export type Without<T, U> = Partial<Record<Exclude<keyof T, keyof U>, never>>

export type ExclusiveOr<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U

export type Mutable<T extends object> = {
  -readonly [K in keyof T]: T[K]
}
