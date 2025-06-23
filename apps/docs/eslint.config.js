import astroConfig from "@repo/style/eslint/astro.js"
import tseslint from "typescript-eslint"

// projectService isn't supported by astro-eslint-parser right now:
// https://github.com/ota-meshi/eslint-plugin-astro/issues/447

export default tseslint.config(astroConfig, {
  languageOptions: {
    parserOptions: {
      project: true,
      projectService: false,
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
