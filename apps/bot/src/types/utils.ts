// unions //

export type Arrayable<T> = T | T[]
export type Awaitable<T> = T | Promise<T>
export type Nullable<T> = T | null

// strings //

export type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamel<U>>}`
  : S

export type PascalToSentence<S extends string> =
  S extends `${infer T}${infer U}`
    ? `${Lowercase<T>}${U extends Capitalize<U> ? ` ${Lowercase<U>}` : PascalToSentence<U>}`
    : S

export type TrimTrailingSpaces<S extends string> = S extends `${infer R} `
  ? TrimTrailingSpaces<R>
  : S

export type ChannelTypeName<S extends string> = TrimTrailingSpaces<
  S extends `${infer Prefix}Guild${infer Suffix}`
    ? PascalToSentence<`${Prefix}${Suffix}`>
    : PascalToSentence<S>
>

// arrays //

export type TupleOf<
  T,
  N extends number,
  R extends T[] = [],
> = R["length"] extends N ? R : TupleOf<T, N, [T, ...R]>

export type ValueOf<T extends object | Array<unknown>> =
  T extends Array<infer U> ? U : T[keyof T]
