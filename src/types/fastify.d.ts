import { FastifyRequest, FastifyReply } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    verifyAdmin: (request: FastifyRequest, reply: FastifyReply, done: (err?: Error) => void) => void
    verifyReputation: (request: FastifyRequest, reply: FastifyReply, done: (err?: Error) => void) => void
  }
}
