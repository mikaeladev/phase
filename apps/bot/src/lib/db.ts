import { Database } from "@repo/db"

const db = new Database({
  autoIndex: true,
  debug: false,
})

export { db }
export * from "@repo/db"
