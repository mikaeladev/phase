import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert"
import { Icon } from "@repo/ui/icon"
import { TriangleAlertIcon } from "@repo/ui/lucide-icon"

export function BetaAlert() {
  return (
    <Alert variant={"warning"}>
      <Icon icon={<TriangleAlertIcon />} />
      <AlertTitle>Beta Module</AlertTitle>
      <AlertDescription>
        This module is still in beta and may not be fully functional yet. Use at
        your own risk.
      </AlertDescription>
    </Alert>
  )
}
