import { drizzle } from "drizzle-orm/node-postgres"

import * as schemas from "~/postgres/schemas"

interface DatabaseConfig {
  uri: string
}

export class Database {
  public readonly uri
  public readonly drizzle

  constructor(config: DatabaseConfig) {
    this.uri = config.uri
    this.drizzle = this.init()
  }

  private init() {
    return drizzle({
      connection: this.uri,
      schema: schemas,
      casing: "snake_case",
    })
  }
}
