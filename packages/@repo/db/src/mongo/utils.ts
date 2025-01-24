import mongoose from "mongoose"

import type { IndexOptions, Model, Schema, SortOrder } from "mongoose"

type ModelIndexValue =
  | true
  | SortOrder
  | (IndexOptions & { sortOrder?: SortOrder })

/**
 * Defines a mongoose model with a given name and schema.
 *
 * @param name The name of the model.
 * @param schema The schema of the model.
 */
export function defineModel<T>(
  name: string,
  schema: Schema<T>,
  indexes?: { [key in keyof T]?: ModelIndexValue },
) {
  for (const index of Object.entries(indexes ?? {})) {
    const [key, value] = index as [keyof T, ModelIndexValue]

    if (typeof value === "object") {
      const { sortOrder, ...options } = value
      schema.index({ [key]: sortOrder ?? "ascending" }, options)
    } else {
      const sortOrder = value === true ? "ascending" : value
      schema.index({ [key]: sortOrder })
    }
  }

  return (mongoose.models[name] as Model<T>) ?? mongoose.model<T>(name, schema)
}
