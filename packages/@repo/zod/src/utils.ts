export type ErrMessage = string | { message?: string }

export function errToStr(message?: ErrMessage): string {
  return typeof message === "string" ? message : (message?.message ?? "")
}

export function errToObj(message?: ErrMessage): { message?: string } {
  return typeof message === "string" ? { message } : (message ?? {})
}
