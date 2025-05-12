import type {} from "@phasejs/core"

import type { PermissionResolvable } from "discord.js"

declare module "@phasejs/core" {
  interface BotCommandMetadata {
    dmPermission?: boolean
    requiredBotPermissions?: PermissionResolvable
    requiredUserPermissions?: PermissionResolvable
  }
}
