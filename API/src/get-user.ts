import 'dotenv/config'
import Axios from 'axios'
import path from 'path'
import { Auth } from 'types/twitch'

export const getUser = async (login: string) => {
  return await import(path.join(__dirname, '../', 'auth.json')).then(
    async (auth: Auth) => {
      return await Axios.get('https://api.twitch.tv/helix/users', {
        headers: {
          'Client-ID': process.env.CHATBOT_ID!,
          Authorization: `Bearer ${auth?.access_token}`,
        },
        params: { login: login },
      })
        .then((response) => response.data.data[0])
        .catch((error) => error)
    }
  )
}
