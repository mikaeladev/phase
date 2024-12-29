import www from "../www"

export default {
  ...www,
  title: "Docs",
  url: process.env.VERCEL
    ? `https://${process.env.VERCEL_URL}/docs`
    : "http://localhost:3002/docs",
}
