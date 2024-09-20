import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'

function authRoute(fastify: FastifyInstance, _options: FastifyPluginOptions, done: (err?: Error) => void) {
  //   fastify.get('/login', (_req, reply) => {
  //     return reply.status(201).send({ message: 'Login route' })
  //   })

  fastify.post('/register', {
    schema: {
      tags: ['AuthController'],
      response: {
        201: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    },
    handler: (_req: FastifyRequest, reply: FastifyReply) => {
      return reply.status(201).send({ message: 'Register route' })
    }
  }),
    fastify.post('/login', {
      schema: {
        tags: ['AuthController'],
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      },
      handler: (_req: FastifyRequest, reply: FastifyReply) => {
        return reply.status(200).send({ message: 'Login route' })
      }
    }),
    done()
}
export default authRoute
