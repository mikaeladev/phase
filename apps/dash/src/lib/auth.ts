import { auth as _auth } from "@repo/auth"

export const middleware = _auth

export const getSession = async () => {
  const session = await _auth()
  if (!session) throw new Error("Not authenticated")
  return session
}
