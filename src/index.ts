import dotenv from 'dotenv'
import { fastify, FastifyReply, FastifyRequest } from 'fastify'
import fastifySwagger, { SwaggerOptions } from '@fastify/swagger'
import fastifySwaggerUi, { FastifySwaggerUiOptions } from '@fastify/swagger-ui'
import cors from '@fastify/cors'
import { FastifyInstance } from 'fastify/types/instance'
import { sum } from '@/utils/sum'
const p: number = +process.env.PORT || 4000
dotenv.config()
const server: FastifyInstance = fastify({ logger: true })
const swaggerOptions: SwaggerOptions = {
  swagger: {
    info: {
      title: 'My Title',
      description: 'My Description.',
      version: '1.0.0'
    },
    host: 'localhost',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [{ name: 'Default', description: 'Default' }],
    securityDefinitions: {
      ApiKeyAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header' // Indicates the `Authorization` header will be used
      }
    },
    security: [
      {
        ApiKeyAuth: [] // Apply `Authorization` header globally
      }
    ]
  }
}

const swaggerUiOptions: FastifySwaggerUiOptions = {
  routePrefix: '/docs',
  uiConfig: {
    // docExpansion: 'full',
    // deepLinking: false
    persistAuthorization: true
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next()
    },
    preHandler: function (request, reply, next) {
      next()
    }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject
  },
  transformSpecificationClone: true
}
server.register(cors, {
  origin: '*',
  credentials: true,
  allowedHeaders: ['Authorization']
})
server.register(fastifySwagger, swaggerOptions)
server.register(fastifySwaggerUi, swaggerUiOptions)

server.register((app, options, done) => {
  app.get('/get', {
    schema: {
      tags: ['Default'],
      response: {
        200: {
          type: 'object',
          properties: {
            anything: { type: 'string' }
          }
        }
      }
    },
    handler: (req, res) => {
      res.send({ anything: 'meaningfull' })
    }
  }),
    app.get('/', {
      schema: {
        tags: ['Default'],
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      },
      handler: (req: FastifyRequest, reply: FastifyReply) => {
        return reply.status(200).send({ message: 'Welcome to the server👋👋' })
      }
    }),
    done()
})

// server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
//   return reply.status(200).send({ message: 'Welcome to the server👋👋' })
// })

const startServer = async (): Promise<void> => {
  const rs = sum(1, 2)
  console.log(rs)
  try {
    await server.listen({ port: p })
    const address = server.server.address()
    const port = typeof address === 'string' ? address : address!.port
    console.log(`Server listening on http://localhost:${port}`)
    console.log(server.printRoutes())
  } catch (error) {
    server.log.error(error)
    process.exit(1)
  }
}

startServer()
