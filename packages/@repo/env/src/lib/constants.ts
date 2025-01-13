export const runtimeEnv = // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env
    : process.env

export const baseOptions = {
  emptyStringAsUndefined: true,
  runtimeEnv: runtimeEnv,
  skipValidation: !!runtimeEnv.SKIP_ENV_VALIDATION,
  server: {},
}
