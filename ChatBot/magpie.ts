import tmi from "tmi.js"
import "dotenv/config"
import { channels } from "./config.json"

const config = {
  identity: {
    username: process.env.CHATBOT_USERNAME,
    password: process.env.CHATBOT_PASSWORD,
  },
  channels: channels,
}

console.log(config)
