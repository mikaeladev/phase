import type { Prettify, UnionToIntersection } from "~/types/utils"

type Env = Readonly<Record<string, unknown>>
type MergeEnvs<T extends Env[]> = Prettify<UnionToIntersection<T[number]>>

export function mergeEnvs<T extends [Env, Env, ...Env[]]>(...envs: T) {
  return Object.fromEntries(envs.flatMap(Object.entries)) as MergeEnvs<T>
}
