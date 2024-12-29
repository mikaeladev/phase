import www from "../www"

export default {
  ...www,
  title: "Dashboard",
  url: process.env.VERCEL
    ? `https://${process.env.VERCEL_URL}/dashboard`
    : "http://localhost:3001/dashboard",
}
