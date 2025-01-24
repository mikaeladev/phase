import { Schema } from "mongoose"

import { defineModel } from "~/mongo/utils"

export interface Giveaway {
  /** The ID of the giveaway. */
  id: string
  /** The date the giveaway expires in unix epoch millisecond time. */
  expires: string
  /** Whether or not the giveaway has expired. */
  expired: boolean
  /** The channel the giveaway is in. */
  channel: string
  /** The giveaway's creation date in unix epoch millisecond time. */
  created: string
  /** The giveaway host's user ID. */
  host: string
  /** The number of winners to select when the giveaway ends. */
  winners: number
  /** The prize of the giveaway. */
  prize: string
  /** The duration of the giveaway in milliseconds. */
  duration: string
}

const giveawaySchema = new Schema<Giveaway>({
  id: { type: Schema.Types.String, required: true, unique: true },
  expires: { type: Schema.Types.String, required: true, index: true },
  expired: { type: Schema.Types.Boolean, required: true, index: true },
  channel: { type: Schema.Types.String, required: true },
  created: { type: Schema.Types.String, required: true },
  host: { type: Schema.Types.String, required: true },
  winners: { type: Schema.Types.Number, required: true },
  prize: { type: Schema.Types.String, required: true },
  duration: { type: Schema.Types.String, required: true },
})

export const giveaways = defineModel("Giveaways", giveawaySchema)
