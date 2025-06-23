import globals from "globals"
import tseslint from "typescript-eslint"

import baseConfig from "./base.js"
import reactPluginConfig from "./plugins/react.js"

export default tseslint.config(baseConfig, reactPluginConfig, {
  name: "phase/bun",
  languageOptions: {
    globals: {
      ...globals.node,
      Bun: false,
    },
  },
  rules: {
    "import-x/no-unresolved": ["error", { ignore: ["^bun(:\\w+)?$"] }],
  },
})
