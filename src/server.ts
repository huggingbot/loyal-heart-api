import compression from 'compression'
import dotenv from 'dotenv'
import express, { ErrorRequestHandler } from 'express'
import helmet from 'helmet'
import { Server } from 'http'
import morgan from 'morgan'
import path from 'path'

const envPath = path.resolve('.', '.env')

dotenv.config({
  path: envPath,
})

import cors from 'cors'

import { logger } from './logger'
import apiMiddlewareRouter from './middlewares/api.middleware'
import couponRouter from './routers/coupon.route'
import defaultRoute from './routers/default.route'
import userRouter from './routers/user.route'
import userCouponRouter from './routers/user-coupon.route'

const nodeEnv = process.env.NODE_ENV || 'development'

export const startServer = async (): Promise<void> => {
  logger.setLevel(process.env.LOG_LEVEL || 'info')

  const app = express()
  const http = new Server(app)

  app.set('trust proxy', 1)
  app.disable('x-powered-by')

  app.use(morgan('tiny', { stream: { write: (message) => logger.logHttp(message.trim()) } })) // http logging
  app.use(compression()) // compresses response
  app.use(helmet()) // adds http headers
  app.use(express.urlencoded({ extended: false })) // parses body
  app.use(express.json()) // parses json

  app.use(
    cors({
      origin: '*',
    }),
  )

  app.use('/', defaultRoute)
  app.use('/api', apiMiddlewareRouter)
  app.use('/api', userRouter)
  app.use('/api', couponRouter)
  app.use('/api', userCouponRouter)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use(((err, _req, res, _next) => {
    if (err instanceof Error && err.stack) {
      logger.error(err.stack)
    }
    res.status(500).send('Something went wrong.')
  }) as ErrorRequestHandler)

  const port = process.env.PORT || 8888

  http.listen(port, () => {
    logger.info(`Node env: ${nodeEnv}`)
    logger.info(`Server running on port: ${port}`)
  })
}
