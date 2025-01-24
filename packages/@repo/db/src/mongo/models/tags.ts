import { Schema } from "mongoose"

import { defineModel } from "~/mongo/utils"

export interface Tag {
  guild: string
  tags: {
    name: string
    value: string
  }[]
}

const tagSchema = new Schema<Tag>({
  guild: { type: Schema.Types.String, required: true, index: true },
  tags: {
    type: [
      new Schema<Tag["tags"][number]>({
        name: { type: Schema.Types.String, required: true },
        value: { type: Schema.Types.String, required: true },
      }),
    ],
    required: true,
  },
})

export const tags = defineModel("Tags", tagSchema)
