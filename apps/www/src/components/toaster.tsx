import { cn } from "@repo/utils/site"
import { Toaster as Sonner } from "sonner"

import { Icon } from "@repo/ui/icon"
import {
  FrownIcon,
  InfoIcon,
  SmileIcon,
  TriangleAlertIcon,
  XIcon,
} from "@repo/ui/lucide-icon"
import { Spinner } from "@repo/ui/spinner"

export function Toaster() {
  return (
    <Sonner
      cn={cn}
      theme="dark"
      toastOptions={{
        className:
          "text-foreground bg-background/75 border shadow-glow-sm p-4 flex items-center w-full rounded-md backdrop-blur-xs select-none cursor-grab active:cursor-grabbing",
        classNames: {
          title: "font-semibold! text-sm!",
          description: "text-muted-foreground",
          icon: "ml-0! mr-2!",
        },
        unstyled: true,
      }}
      icons={{
        success: <Icon icon={<SmileIcon />} />,
        warning: <Icon icon={<TriangleAlertIcon />} />,
        error: <Icon icon={<FrownIcon />} />,
        info: <Icon icon={<InfoIcon />} />,
        close: <Icon icon={<XIcon />} />,
        loading: <Icon icon={<Spinner />} />,
      }}
    />
  )
}
