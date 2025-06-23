import reactPlugin from "eslint-plugin-react"
import hooksPlugin from "eslint-plugin-react-hooks"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config({
  name: "phase/react",
  files: ["**/*.tsx", "**/*.jsx"],
  plugins: {
    react: reactPlugin,
    ["react-hooks"]: hooksPlugin,
  },
  languageOptions: {
    parserOptions: {
      ...reactPlugin.configs.recommended.parserOptions,
      ...reactPlugin.configs["jsx-runtime"].parserOptions,
    },
    globals: {
      ...globals.browser,
    },
  },
  rules: {
    ...reactPlugin.configs.recommended.rules,
    ...reactPlugin.configs["jsx-runtime"].rules,
    ...hooksPlugin.configs["recommended-latest"].rules,
    "react/no-unescaped-entities": "off",
    "react/prop-types": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
})
