export const baseOptions = {
  emptyStringAsUndefined: true,
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  server: {},
}
