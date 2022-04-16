import 'dotenv/config'
import Axios from 'axios'
import { Command } from 'types/command'

const followage: Command = (target, context, client) => {
  Axios.get(`${process.env.API_URL!}/following`, {
    params: {
      from_id: context['user-id'],
      to_name: target.substring(1),
    },
  })
    .then((res) => {
      if (res.data.error) return
      else if (!res.data.isFollowing) {
        client.say(
          target,
          `${context['display-name']} does not follow the channel`
        )
      } else {
        client.say(
          target,
          `${context['display-name']} has been following for ${res.data.followingFor}`
        )
      }
    })
    .catch((error) => console.log(error))
}

const aliases = ['followage', 'following']

export default { aliases: aliases, cmd: followage }
