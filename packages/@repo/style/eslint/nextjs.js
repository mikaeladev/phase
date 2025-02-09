// @ts-expect-error no types
import nextPlugin from "@next/eslint-plugin-next"
import globals from "globals"
import tseslint from "typescript-eslint"

import base from "./base.js"
import react from "./react.js"

export default tseslint.config(...base, ...react, {
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.browser,
    },
  },
  plugins: {
    "@next/next": nextPlugin,
  },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs["core-web-vitals"].rules,
    "@next/next/no-img-element": "off",
    "@next/next/no-duplicate-head": "off",
  },
})
