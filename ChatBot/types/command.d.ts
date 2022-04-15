import { CommonUserstate } from "tmi.js"

export type Command = (target: string, context: CommonUserstate) => void

export interface CommandExports {
  default: {
    aliases: string[]
    cmd: Command
  }
}

export interface CommandList {
  [alias: string]: Command
}
