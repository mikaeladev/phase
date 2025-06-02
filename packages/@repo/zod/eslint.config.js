import baseConfig from "@repo/style/eslint/base.js"
import tseslint from "typescript-eslint"

tseslint.config(baseConfig, { ignores: ["lib/v3/lib.js"] })
