import Axios from 'axios'
import { Command } from 'types/command'

const randomFact: Command = (target, context, client) => {
  Axios.get(`${process.env.API_URL!}/random-fact`)
    .then((res) => {
      if (res.data.error) return
      else if (res.data.text) {
        client.say(target, `${context['display-name']} ${res.data.text}`)
      }
    })
    .catch((error) => console.log(error))
}

const aliases = ['fact', 'random-fact', 'randomfact', 'rf']

export default { aliases: aliases, cmd: randomFact }
