export type PartialWithRequired<
  T extends object,
  K extends keyof T,
> = Partial<T> & Required<Pick<T, K>>
