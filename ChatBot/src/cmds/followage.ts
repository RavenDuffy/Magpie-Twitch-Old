import Axios from 'axios'
import { Command } from 'types/command'

const followage: Command = (target, context, client) => {
  Axios.get('http://api:3553').then((res) => console.log(res?.data))

  client.say(target, `${context['display-name']} has been following for `)
}

const aliases = ['followage', 'following']

export default { aliases: aliases, cmd: followage }
