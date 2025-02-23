import type { RichtextFlags } from "./index"
import type { GuildElementData } from "~/types/slate"
import type { Element, Path, Range, Text } from "slate"

export type InlineElementSplitter = (
  path: Path,
  node: Text,
) => { element: Element; range: Range; offset: number }[]

const transformationRegex =
  /(?<!\\)<@!?(\d+)>|(?<!\\)<@&(\d+)>|(?<!\\)@(everyone|here)|(?<!\\)<#(\d+)>/g

/**
 * Creates a function that splits inline elements into their own nodes.
 *
 * @param flags - The editor flags.
 * @param guildData - The guild data.
 **/
export function createInlineElementSplitter(
  flags: RichtextFlags,
  guildData: GuildElementData,
) {
  const splitInlineElements: InlineElementSplitter = (path, node) => {
    const results: ReturnType<InlineElementSplitter> = []

    let match

    while ((match = transformationRegex.exec(node.text)) !== null) {
      const matchedText = match[0]
      const matchIndex = match.index
      const id = match[1]!

      const matchedTextRange = {
        anchor: { path, offset: matchIndex },
        focus: { path, offset: matchIndex + matchedText.length },
      }

      let element: Element

      if (matchedText.startsWith("<#") && flags.channels) {
        const channel = guildData.channels.find((ch) => ch.id === id)

        element = {
          type: "channel",
          children: [{ text: "" }],
          data: {
            id,
            name: channel?.name ?? "unknown",
            type: channel?.type ?? 0,
          },
        }
      } else if (matchedText.startsWith("@") && flags.mentions) {
        const mention = matchedText === "@everyone" ? "everyone" : "here"

        element = {
          type: "mention",
          children: [{ text: "" }],
          data: {
            id,
            name: mention,
            type: mention,
            colour: "#f8f8f8",
          },
        }
      } else if (matchedText.startsWith("<@&") && flags.mentions) {
        const role = guildData.mentions.find((role) => role.id === id)

        element = {
          type: "mention",
          children: [{ text: "" }],
          data: {
            id,
            name: role?.name ?? "unknown",
            colour: role?.colour ?? "#f8f8f8",
            type: "role",
          },
        }
      } else {
        element = {
          type: "mention",
          children: [{ text: "" }],
          data: {
            id,
            name: "user",
            type: "user",
            colour: "#f8f8f8",
          },
        }
      }

      results.push({
        element,
        range: matchedTextRange,
        offset: matchIndex,
      })
    }

    return results
  }

  return splitInlineElements
}
