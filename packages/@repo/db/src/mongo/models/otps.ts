import { Schema } from "mongoose"

import { defineModel } from "~/mongo/utils"

export interface Otp {
  otp: string
  userId: string
  guildId: string
  createdAt: Date
}

const otpSchema = new Schema<Otp>({
  otp: { type: Schema.Types.String, required: true, unique: true },
  userId: { type: Schema.Types.String, required: true },
  guildId: { type: Schema.Types.String, required: true },
  createdAt: {
    type: Schema.Types.Date,
    expires: "1m",
    required: true,
    default: Date.now,
  },
})

export const otps = defineModel("Otps", otpSchema)
