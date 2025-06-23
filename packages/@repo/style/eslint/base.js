import eslint from "@eslint/js"
import eslintPluginImport from "eslint-plugin-import-x"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  eslintPluginImport.flatConfigs.recommended,
  eslintPluginImport.flatConfigs.typescript,
  {
    name: "phase/base",
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // typescript-eslint
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
      // import-x
      "import-x/no-extraneous-dependencies": [
        "error",
        {
          includeTypes: true,
          packageDir: ["./", "../../", "../../../"],
        },
      ],
    },
  },
  {
    // i sure do love eslint v9
    // https://github.com/eslint/eslint/discussions/18304
    ignores: [
      "**/.astro/*",
      "**/.phase/*",
      "**/.next/*",
      "**/dist/*",
      "**/node_modules/*",
    ],
  },
)
