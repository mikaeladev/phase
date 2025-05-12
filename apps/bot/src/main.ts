import { loadApp } from "@phasejs/loaders"

import { phaseClient } from "~/lib/clients/phase"

const app = await loadApp(phaseClient)

await phaseClient.init(app)
