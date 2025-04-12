module.exports = {
  title: "Phase Bot",
  description:
    "Phase is a free to use, open source Discord bot that aims to be the all-in-one solution for as many servers as possible.",
  keywords: ["Discord", "Bot", "Phase", "Free"],
  developer: {
    name: "mikaela",
    url: "https://github.com/mikaeladev",
  },
  get url() {
    const baseURL =
      process.env.PUBLIC_BASE_URL ??
      process.env.BASE_URL ??
      process.env.NEXT_PUBLIC_BASE_URL

    if (!baseURL) {
      if (process.env.SKIP_ENV_VALIDATION) {
        return "http://localhost:3000"
      }

      throw new Error(
        "'BASE_URL', 'NEXT_PUBLIC_BASE_URL', or 'PUBLIC_BASE_URL' must be set.",
      )
    }

    return baseURL
  },
  get images() {
    return {
      logo: new URL("/phase.png", this.url),
      favicon: new URL("/favicon.ico", this.url),
      apple: new URL("/apple.png", this.url),
    }
  },
}
