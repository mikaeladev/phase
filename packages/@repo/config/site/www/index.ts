export default {
  url: process.env.BASE_URL!,
  title: "Phase Bot",
  description:
    "Phase is a free to use, open source Discord bot that aims to be the all-in-one solution for as many servers as possible.",
  keywords: ["Discord", "Bot", "Phase", "Free"],
  developer: {
    name: "mikaela",
    url: "https://github.com/mikaeladev",
  },
  images: {
    logo: new URL("/phase.png", process.env.BASE_URL),
    favicon: new URL("/favicon.ico", process.env.BASE_URL),
    apple: new URL("/apple.png", process.env.BASE_URL),
  },
}
