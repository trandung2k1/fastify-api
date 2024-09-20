import logger from '@/middlewares/logger'
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'
function userRoute(fastify: FastifyInstance, _options: FastifyPluginOptions, done: (err?: Error) => void) {
  fastify.after(() => {
    fastify.route({
      method: 'GET',
      url: '/test',
      preHandler: fastify.auth([fastify.verifyAdmin, fastify.verifyReputation], {
        relation: 'and'
      }),
      schema: {
        tags: ['UserController'],
        response: {
          201: {
            type: 'object',
            properties: {
              hello: { type: 'string' }
            }
          }
        }
      },
      handler: (req, reply) => {
        req.log.info('Auth route')
        reply.send({ hello: 'world' })
      }
    })
  })

  fastify.get('/', {
    // preHandler: fastify.auth([fastify.verifyAdmin, fastify.verifyReputation], {
    //   relation: 'and'
    // }),
    preHandler: [logger],
    schema: {
      tags: ['UserController'],
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
    done()
}
export default userRoute
