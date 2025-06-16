import { toggleProcedures } from "~/server/router/guilds/modules/toggle"
import { updateProcedures } from "~/server/router/guilds/modules/update"
import { router } from "~/server/trpc"

export const modulesRouter = router({
  ...toggleProcedures,
  ...updateProcedures,
})
