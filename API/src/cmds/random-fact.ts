import { Command, CommandDescription, Fact } from 'types/api'
import { facts } from '../res/facts.json'

export const description: CommandDescription = {
  endpoint: 'random-fact',
  description: 'Will return a fact about something',
}

export const randomFact: Command = async (_req, res, authFile) => {
  const fact: Fact = facts[Math.round(facts.length * Math.random())]

  res.status(200)
  res.send(fact)
}
