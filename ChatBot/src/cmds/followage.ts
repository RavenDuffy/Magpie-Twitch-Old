import { Command } from 'types/command'

const followage: Command = (target, context, client) => {
  client.say(target, `${context['display-name']} has been following for `)
}

const aliases = ['followage', 'following']

export default { aliases: aliases, cmd: followage }
