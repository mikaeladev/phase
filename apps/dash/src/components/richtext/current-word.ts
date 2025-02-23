import cloneDeep from "lodash.clonedeep"
import { Editor, Range } from "slate"

import type { RichtextEditor, RichtextFlags } from "./index"
import type { BasePoint } from "slate"
import type { ReactEditor } from "slate-react"

const getLeftChar = (editor: ReactEditor, point: BasePoint) => {
  const end = Range.end(editor.selection!)
  return Editor.string(editor, {
    anchor: {
      path: end.path,
      offset: point.offset - 1,
    },
    focus: {
      path: end.path,
      offset: point.offset,
    },
  })
}

const getRightChar = (editor: ReactEditor, point: BasePoint) => {
  const end = Range.end(editor.selection!)
  return Editor.string(editor, {
    anchor: {
      path: end.path,
      offset: point.offset,
    },
    focus: {
      path: end.path,
      offset: point.offset + 1,
    },
  })
}

export const getCurrentWord = (
  editor: RichtextEditor,
  flags: RichtextFlags,
) => {
  const { selection } = editor
  if (!selection) return undefined

  const wordRegexp = /[0-9a-zA-Z-_@#]/

  const end = Range.end(selection) // end is a point
  let word = ""
  const currentPosition = cloneDeep(end)
  let startOffset = end.offset
  let endOffset = end.offset

  // go left from cursor until it finds the non-word character
  while (
    currentPosition.offset >= 0 &&
    wordRegexp.exec(getLeftChar(editor, currentPosition))
  ) {
    word = getLeftChar(editor, currentPosition) + word
    startOffset = currentPosition.offset - 1
    currentPosition.offset--
  }

  // go right from cursor until it finds the non-word character
  currentPosition.offset = end.offset
  while (
    word.length &&
    wordRegexp.exec(getRightChar(editor, currentPosition))
  ) {
    word += getRightChar(editor, currentPosition)
    endOffset = currentPosition.offset + 1
    currentPosition.offset++
  }

  const range: Range = {
    anchor: {
      path: end.path,
      offset: startOffset,
    },
    focus: {
      path: end.path,
      offset: endOffset,
    },
  }

  return {
    word,
    range,
    type:
      word?.startsWith("#") && flags.channels
        ? ("channel" as const)
        : word?.startsWith("@") && flags.mentions
          ? ("mention" as const)
          : ("text" as const),
  }
}
