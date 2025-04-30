export type Awaitable<T> = T | Promise<T>

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
