const baseURL = process.env.BASE_URL ?? process.env.NEXT_PUBLIC_BASE_URL
if (!baseURL) throw new Error("BASE_URL is not set")

export default {
  url: baseURL,
  title: "Phase Bot",
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
