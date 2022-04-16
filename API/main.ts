import 'dotenv/config'
import Fastify from 'fastify'
import middie from 'middie'
import path from 'path'
import fs from 'fs'
import ms from 'ms'
import Axios, { AxiosResponse } from 'axios'
import { Auth, AuthResponse } from 'types/twitch'
import { FollowingParams, FollowingPayload } from 'types/api'
import { getUser } from './src/get-user'

const app = Fastify({ logger: true })
app.register(middie)

let authFile: Auth | undefined
fs.existsSync(path.join(__dirname, 'auth.json')) &&
  import(path.join(__dirname, 'auth.json')).then(
    (auth: Auth) => (authFile = auth)
  )

const runAuth = (): void => {
  Axios.post('https://id.twitch.tv/oauth2/token', null, {
    params: {
      client_id: process.env.CHATBOT_ID,
      client_secret: process.env.CHATBOT_SECRET,
      grant_type: 'client_credentials',
    },
  }).then((res: AxiosResponse<AuthResponse, any>) => {
    fs.writeFileSync(
      path.join(__dirname, 'auth.json'),
      JSON.stringify({
        ...res.data,
        expires_on: new Date().getTime() + res.data.expires_in - 5000,
      })
    )
    import(path.join(__dirname, 'auth.json')).then((auth: Auth) => {
      authFile = auth
    })
  })
}
app.addHook('onRequest', async (_req, _res) => {
  if (!fs.existsSync(path.join(__dirname, 'auth.json'))) {
    runAuth()
  } else {
    import(path.join(__dirname, 'auth.json')).then((auth: Auth) => {
      if (auth.expires_on < new Date().getTime()) runAuth()
    })
  }
})

app.get('/', (_req, res) => {
  res.send({ message: 'Welcome to the MagpieMod API!' })
})
app.get('/following', async (req, res) => {
  const { from_id, to_name } = req.query as FollowingParams
  if (!(from_id && to_name)) return

  const to = await getUser(to_name)
  const payload: FollowingPayload = {
    followingFor: 0,
    isFollowing: false,
    error: null,
  }

  Axios.get(`https://api.twitch.tv/helix/users/follows`, {
    headers: {
      'Client-ID': process.env.CHATBOT_ID!,
      Authorization: `Bearer ${authFile?.access_token}`,
    },
    params: {
      from_id: from_id,
      to_id: to?.id,
    },
  })
    .then((response) => {
      if (response?.data?.data[0] === undefined) {
        res.send({ ...payload })
        return
      }
      const followedTimeStamp = new Date(
        response?.data?.data[0]?.followed_at
      ).getTime()
      const followedTimeDiff = new Date().getTime() - followedTimeStamp

      res.send({
        ...payload,
        isFollowing: true,
        followingFor: ms(followedTimeDiff, { long: true }),
      })
    })
    .catch((error) => res.send({ ...payload, error: error }))
})

app.listen(3553, '0.0.0.0', (error) => {
  if (error) throw error
})
