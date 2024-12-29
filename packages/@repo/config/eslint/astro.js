import astroPlugin from "eslint-plugin-astro"
import tseslint from "typescript-eslint"

import base from "./base.js"

export default tseslint.config(...base, ...astroPlugin.configs.recommended)
