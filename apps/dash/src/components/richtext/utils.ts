import { Element, Text } from "slate"

import type { RichtextFlags } from "./index"
import type { TextElement } from "~/types/slate"

// default flags //

export const defaultRichtextFlags = {
  input: {
    multiline: false,
    decorations: true,
    variables: true,
  },
  textarea: {
    multiline: true,
    decorations: true,
    mentions: true,
    channels: true,
    variables: true,
  },
} satisfies Record<string, RichtextFlags>

// type guards //

export function isText(descendant: unknown): descendant is Text {
  return Text.isText(descendant)
}

export function isElement(descendant: unknown): descendant is Element {
  return Element.isElement(descendant)
}

export function isRootElement(descendant: unknown): descendant is TextElement {
  return isElement(descendant) && descendant.type === "text"
}
