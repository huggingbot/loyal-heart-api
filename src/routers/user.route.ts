import express from 'express'

import { CreateUserController } from '@/controllers/user/create-user.controller'
import { DeleteUsersController } from '@/controllers/user/delete-users.controller'
import { UpdateUserController } from '@/controllers/user/update-user.controller'

import { GetUsersController } from '../controllers/user/get-users.controller'
import authMiddleware from '../middlewares/auth.middleware'
import { UserService } from '../modules/user'

const userBaseRoute = `/users`

const userRoutes = express.Router()

const userService = new UserService()

userRoutes.get(`${userBaseRoute}`, authMiddleware, (req, res, next) => {
  new GetUsersController(userService).handleRequest(req, res).catch((err: unknown) => next(err))
})

userRoutes.post(`${userBaseRoute}`, authMiddleware, (req, res, next) => {
  new CreateUserController(userService).handleRequest(req, res).catch((err: unknown) => next(err))
})

userRoutes.patch(`${userBaseRoute}`, authMiddleware, (req, res, next) => {
  new UpdateUserController(userService).handleRequest(req, res).catch((err: unknown) => next(err))
})

userRoutes.post(`${userBaseRoute}/delete`, authMiddleware, (req, res, next) => {
  new DeleteUsersController(userService).handleRequest(req, res).catch((err: unknown) => next(err))
})

export default userRoutes
