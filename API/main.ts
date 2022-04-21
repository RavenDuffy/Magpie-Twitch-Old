import 'dotenv/config'
import Fastify from 'fastify'
import middie from 'middie'
import path from 'path'
import fs from 'fs'
import Axios, { AxiosResponse } from 'axios'
import { Auth, AuthResponse } from 'types/twitch'
import { followage } from './src/cmds/following'
import { CommandDescription, CommandDescriptionExport } from 'types/api'
import { randomFact } from './src/cmds/random-fact'

const app = Fastify({ logger: process.env.NODE_ENV === 'development' })
app.register(middie)

app.decorateReply('sendFile', function (filename: string) {
  const stream = fs.createReadStream(filename)
  this.type('text/html').send(stream)
})

let authFile: Auth | undefined
fs.existsSync(path.join(__dirname, 'twitch.auth.json')) &&
  import(path.join(__dirname, 'twitch.auth.json')).then(
    (auth: Auth) => (authFile = auth)
  )

const runTwitchAuth = (): void => {
  Axios.post('https://id.twitch.tv/oauth2/token', null, {
    params: {
      client_id: process.env.CHATBOT_ID,
      client_secret: process.env.CHATBOT_SECRET,
      grant_type: 'client_credentials',
    },
  }).then((res: AxiosResponse<AuthResponse, any>) => {
    fs.writeFileSync(
      path.join(__dirname, 'twitch.auth.json'),
      JSON.stringify({
        ...res.data,
        expires_on: new Date().getTime() + res.data.expires_in - 5000,
      })
    )
    import(path.join(__dirname, 'twitch.auth.json')).then((auth: Auth) => {
      authFile = auth
    })
  })
}
app.addHook('onRequest', async (_req, _res) => {
  if (!fs.existsSync(path.join(__dirname, 'twitch.auth.json'))) {
    runTwitchAuth()
  } else {
    import(path.join(__dirname, 'twitch.auth.json')).then((auth: Auth) => {
      if (auth.expires_on < new Date().getTime()) runTwitchAuth()
    })
  }
})

app.get('/', async (_req, res) => {
  const cmds: CommandDescription[] = []
  await Promise.all(
    fs
      .readdirSync(path.join(__dirname, 'src/cmds'), 'utf-8')
      .map(async (file) => {
        import(path.join(__dirname, 'src/cmds', file.split('.')[0])).then(
          (cmd: CommandDescriptionExport) => cmds.push(cmd.description)
        )
      })
  )
  const cmdStrings = cmds.map((cmd) => ({ ...cmd }))

  res.send({ welcome: `Welcome to the MagpieMod twitch API`, cmds: cmdStrings })
})
app.get('/following', async (req, res) => followage(req, res, authFile))
app.get('/random-fact', async (req, res) => randomFact(req, res, authFile))

app.listen(3553, '0.0.0.0', (error) => {
  if (error) throw error
})
