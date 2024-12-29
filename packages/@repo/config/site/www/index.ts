const baseURL =
  process.env.VERCEL_ENV === "production"
    ? "https://phasebot.xyz"
    : process.env.VERCEL_ENV === "preview"
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"

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
