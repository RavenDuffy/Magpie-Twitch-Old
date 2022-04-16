import 'dotenv/config'
import Fastify from 'fastify'
import middie from 'middie'
import path from 'path'
import fs from 'fs'
import Axios, { AxiosResponse } from 'axios'
import { Auth, AuthResponse } from 'types/twitch'
import { followage } from './src/cmds/followage'

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
app.get('/following', async (req, res) => followage(req, res, authFile))

app.listen(3553, '0.0.0.0', (error) => {
  if (error) throw error
})
