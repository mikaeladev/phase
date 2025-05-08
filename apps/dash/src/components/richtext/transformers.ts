import { isText } from "./utils"

import type { RichtextFlags } from "./index"
import type {
  ChannelElement,
  GuildElementData,
  MentionElement,
  TextElement,
} from "~/types/slate"

export type DfmTransformer = {
  docToDfm: (elements: TextElement[]) => string
  dfmToDoc: (value: string) => TextElement[]
}

/**
 * Creates a transformer that converts between the document format and Discord
 * flavoured markdown.
 *
 * @param flags - The editor flags.
 * @param guildData - The guild data.
 */
export function createDfmTransformer(
  flags: RichtextFlags,
  guildData: GuildElementData,
): DfmTransformer {
  return {
    docToDfm(elements) {
      return elements
        .map((element) =>
          element.children
            .map((child) => {
              if (isText(child)) return child.text

              if (child.type === "channel" && flags.channels) {
                return `<#${child.data.id}>`
              }

              if (child.type === "mention" && flags.mentions) {
                if (child.data.type === "everyone") return "@everyone"
                if (child.data.type === "here") return "@here"
                if (child.data.type === "role") return `<@&${child.data.id}>`
                if (child.data.type === "user") return `<@!${child.data.id}>`
              }
            })
            .join(""),
        )
        .join("\n")
    },
    dfmToDoc(value) {
      const createMentionElement = (
        data: MentionElement["data"],
      ): MentionElement => ({
        type: "mention",
        children: [{ text: "" }],
        data,
      })

      const createChannelElement = (
        data: ChannelElement["data"],
      ): ChannelElement => ({
        type: "channel",
        children: [{ text: "" }],
        data,
      })

      const lines = value.split("\n")

      return lines.map((line) => {
        const children = []
        const textParts = line.split(/(<[@][!&]?\d+>|@everyone|@here|<#\d+>)/)

        for (let i = 0; i < textParts.length; i++) {
          const part = textParts[i]!
          const previousPart = i > 0 ? textParts[i - 1]! : ""

          if (previousPart.endsWith("\\")) {
            // if the previous part ends with a backslash, treat this part as plain text
            children.push({ text: previousPart.slice(0, -1) + part })
            textParts[i - 1] = "" // clear the previous part to avoid duplication
          } else if (part.startsWith("<@&") && flags.mentions) {
            const roleId = part.slice(3, -1)
            const role = guildData.mentions.find((role) => role.id === roleId)
            children.push(
              createMentionElement({
                id: roleId,
                name: role?.name ?? "unknown",
                colour: role?.colour ?? "#f8f8f8",
                type: "role",
              }),
            )
          } else if (part.startsWith("<@") && flags.mentions) {
            const userId = part.slice(part.startsWith("<@!") ? 3 : 2, -1)
            children.push(
              createMentionElement({
                id: userId,
                name: "user",
                type: "user",
                colour: "#f8f8f8",
              }),
            )
          } else if (part.startsWith("<#") && flags.channels) {
            const channelId = part.slice(2, -1)
            const channel = guildData.channels.find((ch) => ch.id === channelId)
            children.push(
              createChannelElement({
                id: channelId,
                name: channel?.name ?? "unknown",
                type: channel?.type ?? 0,
              }),
            )
          } else if (
            (part === "@everyone" || part === "@here") &&
            flags.mentions
          ) {
            const withoutPrefix = part === "@everyone" ? "everyone" : "here"
            children.push(
              createMentionElement({
                id: withoutPrefix,
                name: withoutPrefix,
                type: withoutPrefix,
                colour: "#f8f8f8",
              }),
            )
          } else {
            children.push({ text: part })
          }
        }

        return { type: "text", children }
      })
    },
  }
}
