import type { UnionToIntersection } from "@repo/utils/types"

type Env = Readonly<Record<string, unknown>>
type MergeEnvs<T extends Env[]> = UnionToIntersection<T[number]>

export function mergeEnvs<T extends [Env, Env, ...Env[]]>(...envs: T) {
  return Object.fromEntries(envs.flatMap(Object.entries)) as MergeEnvs<T>
}
