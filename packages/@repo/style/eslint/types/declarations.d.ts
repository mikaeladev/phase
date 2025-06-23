declare module "@next/eslint-plugin-next" {
  export const flatConfig: Record<
    "recommended" | "coreWebVitals",
    import("@typescript-eslint/utils").TSESLint.FlatConfig.Config
  >
}
