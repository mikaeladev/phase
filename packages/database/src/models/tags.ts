import mongoose from "mongoose"

import { defineModel } from "~/utils"

export interface Tag {
  /** The guild's ID. */
  guild: string
  /** The tags for the guild. */
  tags: {
    /** The name of the tag. */
    name: string
    /** The value of the tag. */
    value: string
  }[]
}

export const Tags = defineModel(
  "Tags",
  new mongoose.Schema<Tag>({
    guild: { type: String, required: true },
    tags: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  }),
)
