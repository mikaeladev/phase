import type { LayoutProps } from "~/types/props"

export default function ContactLayout({ children }: LayoutProps) {
  return (
    <div className="container my-8 size-full max-w-3xl md:my-12">
      {children}
    </div>
  )
}
