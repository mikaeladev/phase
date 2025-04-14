export { version } from "~/../package.json"

export const commandPartsReplaceRegex =
  /^(?:.*\/)?app\/commands\/|\([^/]+\)\/|[^/]+$/g

// command path regex pattern:
// 1. must start with "/app/commands/"
// 2. any number of parenthesised dirs
// 3. up to 2 non-parenthesised dirs:
//    - each can have nested parenthesised dirs,
//    - none starting with "_"
// 4. filename that doesn’t start with "_"

export const commandPathFilterRegex = [
  "^(?:.*\\/)?app\\/commands\\/",
  "(?:\\([^/]+\\)\\/)*",
  "(?:[^_/][^/]*\\/(?:\\([^/]+\\)\\/)*){0,2}",
  "[^_/][^/]*$",
].join("")

// cron path regex pattern:
// 1. must start with "/app/crons/"
// 2. any number of dirs:
//    - can be parenthesised or not,
//    - none starting with "_"
// 3. filename that doesn’t start with "_"

export const cronPathFilterRegex = [
  "^(?:.*\\/)?app\\/crons\\/",
  "(?:(?:\\([^/]+\\)|[^_/][^/]*)\\/)*",
  "[^_/][^/]*$",
].join("")

// event path regex pattern:
// 1. must start with "/app/events/"
// 2. any number of dirs:
//    - can be parenthesised or not,
//    - none starting with "_"
// 3. filename that doesn’t start with "_"

export const eventPathFilterRegex = [
  "^(?:.*\\/)?app\\/events\\/",
  "(?:(?:\\([^/]+\\)|[^_/][^/]*)\\/)*",
  "[^_/][^/]*$",
].join("")

export const regexFilterPatterns = {
  command: commandPathFilterRegex,
  cron: cronPathFilterRegex,
  event: eventPathFilterRegex,
}
