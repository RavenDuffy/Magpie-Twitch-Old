import tmi from "tmi.js"
import "dotenv/config"
import { channels } from "./config.json"
import { messageHandler } from "./src/message-handler"

const config = {
  identity: {
    username: process.env.CHATBOT_USERNAME,
    password: process.env.CHATBOT_PASSWORD,
  },
  channels: channels,
}

const client = new tmi.client(config)

client.on("message", messageHandler)

client.connect()
