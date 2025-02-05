import type { LayoutProps } from "~/types/props"

export default function LegalLayout({ children }: LayoutProps) {
  return (
    <div className="prose container my-8 size-full max-w-3xl md:my-12">
      {children}
    </div>
  )
}
