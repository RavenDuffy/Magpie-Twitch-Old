import { Command, CommandDescription } from 'types/api'

export const description: CommandDescription = {
  endpoint: 'random-fact',
  description: 'Will return a fact about something',
}

export const randomFact: Command = async (req, res, authFile) => {}
