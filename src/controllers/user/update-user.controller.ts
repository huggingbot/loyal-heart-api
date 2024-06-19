import express from 'express'

import { zUpdateUserSchema } from '@/modules/user/schema'

import { UserService, UserServiceException, UserValidationError } from '../../modules/user'
import { IErrorResponse } from '../../types'
import { BaseController } from '../common'

export class UpdateUserController extends BaseController {
  private userService: UserService

  public constructor(userService: UserService) {
    super('UPDATE_USER_CONTROLLER')
    this.userService = userService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = zUpdateUserSchema.safeParse(req.body)
      if (!result.success) {
        const error = { message: 'invalid request body', ...result.error.format() }
        this.logFailure(req, { error })
        const response: IErrorResponse = { message: error.message }
        res.status(400).json(response)
        return
      }
      await this.userService.updateUser(result.data)

      res.status(200).json({ status: 'success' })
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof UserValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IErrorResponse = { message: 'update user validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof UserServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IErrorResponse = { message: 'update user service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected update user error: ${(err as Error).toString()}` })
        const response: IErrorResponse = { message: 'unexpected update user error' }
        res.status(500).json(response)
        return
      }
    }
  }
}
