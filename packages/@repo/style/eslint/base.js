import eslint from "@eslint/js"
import eslintPluginImport from "eslint-plugin-import-x"
import eslintPluginYml from "eslint-plugin-yml"
import globals from "globals"
import tseslint from "typescript-eslint"

const importPluginConfig = tseslint.config(
  eslintPluginImport.flatConfigs.recommended,
  eslintPluginImport.flatConfigs.typescript,
  {
    rules: {
      "import-x/no-extraneous-dependencies": [
        "error",
        {
          includeTypes: true,
          packageDir: ["./", "../../", "../../../"],
        },
      ],
      "import-x/no-unresolved": [
        "error",
        {
          ignore: ["^astro(:\\w+)?$"],
        },
      ],
    },
  },
)

const ignoresConfig = tseslint.config({
  ignores: ["dist/", "node_modules/", ".astro/", ".next/", ".phase/"],
})

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...eslintPluginYml.configs["flat/recommended"],
  ...importPluginConfig,
  ...ignoresConfig,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },
)
