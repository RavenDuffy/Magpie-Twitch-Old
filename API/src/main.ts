import Fastify from "fastify"

const app = Fastify({ logger: true })

app.get("/", (req, res) => {
  res.send({ message: "Welcome to the MagpieMod API!" })
})

app.listen(3553, "0.0.0.0", (error, address) => {
  if (error) throw error
  console.log(`Listening on ${address}`)
})
