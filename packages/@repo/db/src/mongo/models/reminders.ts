import { Schema } from "mongoose"

import { defineModel } from "~/mongo/utils"

export interface Reminder {
  guild: string // 123456789012345678
  channel: string // 123456789012345678
  name: string // lorem ipsum
  content: string // lorem ipsum dolor sit amet
  mention?: string // <@123456789012345678>
  delay: number // 60_000 -> 1 minute
  loop: boolean // false
  createdAt: Date // 2023-07-01T00:00:00.000Z
  scheduledAt: Date // 2023-07-01T00:01:00.000Z
}

const reminderSchema = new Schema<Reminder>({
  guild: { type: Schema.Types.String, required: true, index: true },
  channel: { type: Schema.Types.String, required: true },
  name: { type: Schema.Types.String, required: true },
  content: { type: Schema.Types.String, required: true },
  mention: { type: Schema.Types.String },
  delay: { type: Schema.Types.Number, required: true, min: 0 },
  loop: { type: Schema.Types.Boolean, default: false },
  createdAt: { type: Schema.Types.Date, default: Date.now },
  scheduledAt: {
    type: Schema.Types.Date,
    index: true,
    default() {
      return new Date(Date.now() + this.delay)
    },
  },
})

export const reminders = defineModel("Reminders", reminderSchema)
