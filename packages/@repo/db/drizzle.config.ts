import { defineConfig } from "drizzle-kit"

if (!process.env.POSTGRES_URI) {
  throw new Error("POSTGRES_URI is not set.")
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/postgres/schemas/**/*",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URI,
  },
})
