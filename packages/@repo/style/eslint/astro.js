import astroPlugin from "eslint-plugin-astro"
import tseslint from "typescript-eslint"

import baseConfig from "./base.js"
import reactPluginConfig from "./plugins/react.js"

export default tseslint.config(
  baseConfig,
  reactPluginConfig,
  astroPlugin.configs["flat/recommended"],
  {
    name: "phase/astro",
    rules: {
      "import-x/no-unresolved": ["error", { ignore: ["^astro(:\\w+)?$"] }],
    },
  },
)
