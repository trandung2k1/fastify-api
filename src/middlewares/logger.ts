import { FastifyReply, FastifyRequest } from 'fastify'

const logger = (req: FastifyRequest, reply: FastifyReply, done: (err?: Error) => void) => {
  console.log('Logger')
  done()
}
export default logger
