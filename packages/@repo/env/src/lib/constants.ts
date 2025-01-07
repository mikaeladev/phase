export const baseOptions = {
  emptyStringAsUndefined: true,
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  clientPrefix: "NEXT_PUBLIC_" as const,
  server: {},
  client: {},
}
