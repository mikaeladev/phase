type ConfigVariables = {
  port: string
  baseURL: string
  basePath: string | undefined
}

export function createSiteConfig(variables: ConfigVariables) {
  const { port, baseURL, basePath } = variables

  return {
    title:
      basePath === "/dashboard"
        ? "Phase Dashboard"
        : basePath === "/docs"
          ? "Phase Docs"
          : "Phase Bot",
    port: Number(port ?? 3000),
    url: baseURL + (basePath ?? ""),
    baseUrl: baseURL,
    basePath,
    description:
      "Phase is a free to use, open source Discord bot that aims to be the all-in-one solution for as many servers as possible.",
    keywords: ["Discord", "Bot", "Phase", "Free"],
    developer: {
      name: "mikaela",
      url: "https://github.com/mikaeladev",
    },
    images: {
      logo: new URL("/phase.png", baseURL),
      favicon: new URL("/favicon.ico", baseURL),
      apple: new URL("/apple.png", baseURL),
    },
  }
}
