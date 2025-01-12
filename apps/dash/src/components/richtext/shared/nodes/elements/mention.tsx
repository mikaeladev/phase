"use client"

import type { RenderElementProps } from "slate-react"

export interface MentionElementNodeProps extends RenderElementProps {
  element: Extract<RenderElementProps["element"], { type: "mention" }>
}

export function MentionElementNode({
  element,
  attributes,
  children,
}: MentionElementNodeProps) {
  return (
    <span {...attributes} className="h-4 cursor-default">
      <span
        className="rounded-[4px] px-1 whitespace-nowrap"
        style={{
          color: element.data.colour,
          backgroundColor: element.data.colour + "40",
        }}
      >
        <span className="leading-none">{"@" + element.data.name}</span>
      </span>
      {children}
    </span>
  )
}
