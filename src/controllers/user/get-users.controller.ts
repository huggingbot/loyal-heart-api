import express from 'express'

import { UserService, UserServiceException, UserValidationError } from '@/modules/user'
import { zGetUsersRequestSchema } from '@/modules/user/schema'
import { IErrorResponse } from '@/types'

import { BaseController } from '../common'

export class GetUsersController extends BaseController {
  private userService: UserService

  public constructor(userService: UserService) {
    super('GET_USERS_CONTROLLER')
    this.userService = userService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const parseResult = zGetUsersRequestSchema.safeParse(req.query)
      if (!parseResult.success) {
        const error = { message: 'invalid request query', ...parseResult.error.format() }
        this.logFailure(req, { error })
        const response: IErrorResponse = { message: error.message }
        res.status(400).json(response)
        return
      }
      const result = await this.userService.getUsers(parseResult.data)

      res.status(200).json({ status: 'success', data: result })
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof UserValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IErrorResponse = { message: 'get users validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof UserServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IErrorResponse = { message: 'get users service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected get users error: ${(err as Error).toString()}` })
        const response: IErrorResponse = { message: 'unexpected get users error' }
        res.status(500).json(response)
        return
      }
    }
  }
}
