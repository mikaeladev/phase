"use client"

import type { RenderPlaceholderProps } from "slate-react"

export function PlaceholderNode({ children }: RenderPlaceholderProps) {
  return (
    <>
      <span
        data-slate-placeholder={true}
        contentEditable={false}
        suppressContentEditableWarning={true}
        className="text-muted-foreground pointer-events-none absolute text-sm select-none"
      >
        {children}
      </span>
      {navigator.userAgent.includes("Android") && <br />}
    </>
  )
}
