function randomString(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let value = ""
  for (let i = 0; i < length - 1; i++) {
    value += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return value
}

function main() {
  const length = process.argv[2]
  if (!length) throw new Error("No length provided")

  const value = randomString(+length)
  console.log(`Random key: ${value}`)
}

main()
