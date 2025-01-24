import { Database } from "@repo/db"

export const db = new Database({
  autoIndex: true,
  debug: false,
})
