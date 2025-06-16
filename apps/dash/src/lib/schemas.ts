import { formModuleSchemas, trpcModuleSchemas } from "@repo/utils/modules"
import { z } from "@repo/zod"

export const modulesFormSchema = z.object(formModuleSchemas).partial()
export const modulesTrpcSchema = z.object(trpcModuleSchemas).nullablePartial()
