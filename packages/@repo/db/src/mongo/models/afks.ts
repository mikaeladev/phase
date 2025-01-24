import { Schema } from "mongoose"

import { defineModel } from "~/mongo/utils"

export interface AFK {
  user: string
  reason?: string
}

const afkSchema = new Schema<AFK>({
  user: { type: Schema.Types.String, required: true, unique: true },
  reason: { type: Schema.Types.String },
})

export const afks = defineModel("AFKs", afkSchema)
