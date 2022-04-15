import fs from "fs"
import { CommandExports, CommandList } from "types/command"

const cmds: CommandList[] = []
fs.readdirSync("src/cmds", "utf-8").forEach((file) => {
  import(`${__dirname}/cmds/${file.split(".")[0]}`).then(
    (cmd: CommandExports) =>
      cmd.default.aliases.forEach((alias) =>
        cmds.push({ [alias]: cmd.default.cmd })
      )
  )
})

export const messageHandler = async (
  target: string,
  context: object,
  msg: string,
  self: boolean
) => {
  if (self || !msg.startsWith("!")) return

  const request = msg.substring(1)

  const command = cmds.find((cmd) => Object.keys(cmd).includes(request))?.[
    request
  ]
  command && command(target, context)
}
