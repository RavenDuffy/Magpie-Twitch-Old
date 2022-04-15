import { Client, CommonUserstate } from 'tmi.js'

export type Command = (
  target: string,
  context: CommonUserstate,
  client: Client
) => void

export interface CommandExports {
  default: {
    aliases: string[]
    cmd: Command
  }
}

export interface CommandList {
  [alias: string]: Command
}
