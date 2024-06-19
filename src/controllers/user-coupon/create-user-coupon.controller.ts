import express from 'express'

import { zCreateUserCouponSchema } from '@/modules/user-coupon/schema'

import { UserCouponService, UserCouponServiceException, UserCouponValidationError } from '../../modules/user-coupon'
import { IErrorResponse } from '../../types'
import { BaseController } from '../common'

export class CreateUserCouponController extends BaseController {
  private userCouponService: UserCouponService

  public constructor(userCouponService: UserCouponService) {
    super('CREATE_USER_COUPON_CONTROLLER')
    this.userCouponService = userCouponService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = zCreateUserCouponSchema.safeParse(req.body)
      if (!result.success) {
        const error = { message: 'invalid request body', ...result.error.format() }
        this.logFailure(req, { error })
        const response: IErrorResponse = { message: error.message }
        res.status(400).json(response)
        return
      }
      await this.userCouponService.addUserCoupon(result.data)

      res.status(200).json({ status: 'success' })
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof UserCouponValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IErrorResponse = { message: 'create user coupon validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof UserCouponServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IErrorResponse = { message: 'create user coupon service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected create user coupon error: ${(err as Error).toString()}` })
        const response: IErrorResponse = { message: 'unexpected create user coupon error' }
        res.status(500).json(response)
        return
      }
    }
  }
}
