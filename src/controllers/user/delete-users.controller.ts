import express from 'express'

import { zDeleteUsersRequestSchema } from '@/modules/user/schema'

import { UserService, UserServiceException, UserValidationError } from '../../modules/user'
import { IErrorResponse } from '../../types'
import { BaseController } from '../common'

export class DeleteUsersController extends BaseController {
  private userService: UserService

  public constructor(userService: UserService) {
    super('DELETE_USERS_CONTROLLER')
    this.userService = userService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = zDeleteUsersRequestSchema.safeParse(req.body)
      if (!result.success) {
        const error = { message: 'invalid request body', ...result.error.format() }
        this.logFailure(req, { error })
        const response: IErrorResponse = { message: error.message }
        res.status(400).json(response)
        return
      }
      await this.userService.deleteUsers(result.data)

      res.status(200).json({ status: 'success' })
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof UserValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IErrorResponse = { message: 'delete users validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof UserServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IErrorResponse = { message: 'delete users service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected delete users error: ${(err as Error).toString()}` })
        const response: IErrorResponse = { message: 'unexpected delete users error' }
        res.status(500).json(response)
        return
      }
    }
  }
}
