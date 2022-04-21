import tmi from 'tmi.js'
import 'dotenv/config'
import { channels } from './config.json'
import { messageHandler } from './src/message-handler'

const twitchConfig = {
  identity: {
    username: process.env.CHATBOT_USERNAME,
    password: process.env.CHATBOT_PASSWORD,
  },
  channels: channels,
}

const client = new tmi.client(twitchConfig)

client.on('message', (...rest) => messageHandler(...rest, client))

client.connect()
