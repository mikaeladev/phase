export const runtimeEnv = process.env

export const baseOptions = {
  emptyStringAsUndefined: true,
  runtimeEnv: runtimeEnv,
  skipValidation: !!runtimeEnv.SKIP_ENV_VALIDATION,
  server: {},
}
