import express from 'express'

import { zUpdateUserCouponSchema } from '@/modules/user-coupon/schema'

import { UserCouponService, UserCouponServiceException, UserCouponValidationError } from '../../modules/user-coupon'
import { IErrorResponse } from '../../types'
import { BaseController } from '../common'

export class UpdateUserCouponController extends BaseController {
  private userCouponService: UserCouponService

  public constructor(userCouponService: UserCouponService) {
    super('UPDATE_USER_COUPON_CONTROLLER')
    this.userCouponService = userCouponService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = zUpdateUserCouponSchema.safeParse(req.body)
      if (!result.success) {
        const error = { message: 'invalid request body', ...result.error.format() }
        this.logFailure(req, { error })
        const response: IErrorResponse = { message: error.message }
        res.status(400).json(response)
        return
      }
      await this.userCouponService.updateUserCoupon(result.data)

      res.status(200).json({ status: 'success' })
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof UserCouponValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IErrorResponse = { message: 'update user coupon validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof UserCouponServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IErrorResponse = { message: 'update user coupon service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected update user coupon error: ${(err as Error).toString()}` })
        const response: IErrorResponse = { message: 'unexpected update user coupon error' }
        res.status(500).json(response)
        return
      }
    }
  }
}
