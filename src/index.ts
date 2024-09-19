import 'dotenv/config'
import { sum } from '@/utils/sum'
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
const p: number = +process.env.PORT || 4000
const server: FastifyInstance = Fastify({ logger: true })
server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  return reply.status(200).send({ message: 'Welcome to the server👋👋' })
})
const startServer = async (): Promise<void> => {
  const rs = sum(1, 2)
  console.log(rs)
  try {
    await server.listen({ port: p })
    const address = server.server.address()
    const port = typeof address === 'string' ? address : address!.port
    console.log(`Server listening on http://localhost:${port}`)
  } catch (error) {
    server.log.error(error)
    process.exit(1)
  }
}

startServer()
