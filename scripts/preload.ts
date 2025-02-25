import { plugin } from "bun"

import { yamlLoader } from "../packages/@repo/config/src/bun/yaml.ts"

plugin(yamlLoader)
