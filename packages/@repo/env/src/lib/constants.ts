export const baseOptions = (runtimeEnv: NodeJS.ProcessEnv) => ({
  emptyStringAsUndefined: true,
  runtimeEnv,
  skipValidation: !!runtimeEnv.SKIP_ENV_VALIDATION,
  server: {},
})

export type BaseOptions = ReturnType<typeof baseOptions>

export const botBaseOptions = {
  ...baseOptions(process.env),
}

export const nextBaseOptions = {
  ...baseOptions(process.env),
  clientPrefix: "NEXT_PUBLIC",
  client: {},
} as const

export const astroBaseOptions = {
  ...baseOptions(process.env),
  clientPrefix: "PUBLIC",
  client: {},
} as const
