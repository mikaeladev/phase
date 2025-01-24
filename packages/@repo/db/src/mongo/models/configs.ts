import { ModuleId } from "@repo/utils/modules"
import { Schema } from "mongoose"

import { defineModel } from "~/mongo/utils"

// status (subdocument) //

interface Status {
  type: StatusType
  text: string
  reason?: string
}

enum StatusType {
  Operational = "online",
  MinorIssues = "idle",
  MajorIssues = "dnd",
}

const statusSchema = new Schema<Status>(
  {
    type: {
      type: Schema.Types.String,
      enum: Object.values(StatusType),
      required: true,
    },
    text: {
      type: Schema.Types.String,
      required: true,
    },
    reason: {
      type: Schema.Types.String,
      required: false,
    },
  },
  { _id: false },
)

// blacklist (subdocument) //

interface Blacklist {
  users: {
    id: string
    reason?: string
  }[]
  guilds: {
    id: string
    reason?: string
  }[]
}

const blacklistSchema = new Schema<Blacklist>(
  {
    users: [
      {
        id: {
          type: Schema.Types.String,
          required: true,
        },
        reason: {
          type: Schema.Types.String,
          required: false,
        },
      },
    ],
    guilds: [
      {
        id: {
          type: Schema.Types.String,
          required: true,
        },
        reason: {
          type: Schema.Types.String,
          required: false,
        },
      },
    ],
  },
  { _id: false },
)

// killswitch (subdocument) //

interface Killswitch {
  modules: ModuleId[]
}

const killswitchSchema = new Schema<Killswitch>(
  {
    modules: {
      type: [
        {
          type: Schema.Types.String,
          enum: Object.values(ModuleId),
          required: true,
        },
      ],
      required: true,
    },
  },
  { _id: false },
)

// config (document) //

export interface Config {
  status: Status
  blacklist: Blacklist
  killswitch: Killswitch
}

const configSchema = new Schema<Config>({
  status: statusSchema,
  blacklist: blacklistSchema,
  killswitch: killswitchSchema,
})

export const configs = defineModel("Configs", configSchema)
