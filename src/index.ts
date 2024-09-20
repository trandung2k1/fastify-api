import dotenv from 'dotenv'
import { fastify, FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import fastifySwagger, { SwaggerOptions } from '@fastify/swagger'
import fastifySwaggerUi, { FastifySwaggerUiOptions } from '@fastify/swagger-ui'
import cors from '@fastify/cors'
import fastifyAuth from '@fastify/auth'
import fastifyCookie from '@fastify/cookie'
import fastifyHelmet from '@fastify/helmet'
import { FastifyInstance } from 'fastify/types/instance'
import authRoute from '@/routes/auth.route'
import userRoute from '@/routes/user.route'
const p: number = +process.env.PORT || 4000
dotenv.config()
const server: FastifyInstance = fastify({ logger: false })
server
  .decorate('verifyAdmin', function (request, reply, done) {
    // your validation logic
    console.log('verifyAdmin')
    done() // pass an error if the authentication fails
  })
  .decorate('verifyReputation', function (request, reply, done) {
    // your validation logic
    console.log('verifyReputation')
    done() // pass an error if the authentication fails
  })

const swaggerOptions: SwaggerOptions = {
  swagger: {
    info: {
      title: 'API Documentation',
      description: 'Description details api .',
      version: '1.0.0'
    },
    host: 'localhost:4000',
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
server.register(fastifyAuth)
server.register(fastifyHelmet)
server.register(fastifyCookie, {
  secret: 'secret-key',
  parseOptions: {
    // secure: true,
    sameSite: 'strict'
    // httpOnly: true
  }
})
server.register((app, options, done) => {
  app.get('/get', {
    schema: {
      tags: ['RootController'],
      response: {
        200: {
          type: 'object',
          properties: {
            msg: { type: 'string' }
          }
        }
      }
    },
    handler: (req, res) => {
      res.send({ msg: 'Get root' })
    }
  }),
    app.get('/', {
      preHandler: app.auth([app.verifyAdmin, app.verifyReputation], {
        relation: 'and'
      }),
      schema: {
        tags: ['RootController'],
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

server.register(authRoute, { prefix: '/api/auth' })
server.register(userRoute, { prefix: '/api/users' })

server.after(() => {
  server.route({
    method: 'GET',
    url: '/test',
    preHandler: server.auth([server.verifyAdmin, server.verifyReputation], {
      relation: 'and'
    }),
    schema: {
      tags: ['RootController'], // Swagger Tag
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

// server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
//   return reply.status(200).send({ message: 'Welcome to the server👋👋' })
// })
server.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    statusCode: 404,
    error: 'Not Found',
    message: `Route ${request.method}:${request.url} not found`
  })
})

server.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  // Log the error
  request.log.error(error)

  // Customize the error response
  reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: error.message
  })
})

const startServer = async (): Promise<void> => {
  retryToStart(server, 10)
  // try {
  //   await server.listen({ port: p })
  //   const address = server.server.address()
  //   const port = typeof address === 'string' ? address : address!.port
  //   console.log(`Server listening on http://localhost:${port}`)
  //   console.log(server.printRoutes())
  // } catch (error) {
  //   server.log.error(error)
  //   process.exit(1)
  // }
}

async function retryToStart(server: FastifyInstance, retryTime: number) {
  if (!retryTime) {
    console.log('Không thể khởi chạy máy chủ')
    return
  }
  try {
    await server.listen({ port: p })
    const address = server.server.address()
    const port = typeof address === 'string' ? address : address!.port
    console.log(`Server listening on http://localhost:${port}`)
    console.log(server.printRoutes())
  } catch (error) {
    setTimeout(async () => {
      await retryToStart(server, retryTime--)
    }, 1000)
  }
}

startServer()
