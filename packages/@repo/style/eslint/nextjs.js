import { flatConfig as nextPluginConfigs } from "@next/eslint-plugin-next"
import tseslint from "typescript-eslint"

import baseConfig from "./base.js"
import reactPluginConfig from "./plugins/react.js"

export default tseslint.config(
  baseConfig,
  reactPluginConfig,
  nextPluginConfigs.recommended,
  nextPluginConfigs.coreWebVitals,
  {
    name: "phase/nextjs",
    rules: {
      "@next/next/no-img-element": "off",
      "@next/next/no-duplicate-head": "off",
    },
  },
)
