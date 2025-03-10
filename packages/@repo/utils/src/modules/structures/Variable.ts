export class Variable<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TArgs extends [any, ...any[]] = [any, ...any[]],
> {
  readonly name: string
  readonly description: string
  readonly syntax: RegExp
  readonly parse: (value: string, ...args: TArgs) => string

  constructor(data: {
    name: string
    description: string
    syntax: RegExp
    parse: (value: string, ...args: TArgs) => string
  }) {
    this.name = data.name
    this.description = data.description
    this.syntax = data.syntax
    this.parse = data.parse
  }
}
