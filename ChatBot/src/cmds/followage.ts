import { CommonUserstate } from "tmi.js"

const followage = (target: string, context: CommonUserstate) => {
  console.log(target, context, "hello")
}

const aliases = ["followage", "following"]

export default { aliases: aliases, cmd: followage }
