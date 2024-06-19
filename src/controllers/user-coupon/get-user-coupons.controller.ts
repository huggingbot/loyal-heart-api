import express from 'express'

import { UserCouponService, UserCouponServiceException, UserCouponValidationError } from '@/modules/user-coupon'
import { zGetUserCouponsRequestSchema } from '@/modules/user-coupon/schema'
import { IErrorResponse } from '@/types'

import { BaseController } from '../common'

export class GetUserCouponsController extends BaseController {
  private userCouponService: UserCouponService

  public constructor(userCouponService: UserCouponService) {
    super('GET_USER_COUPONS_CONTROLLER')
    this.userCouponService = userCouponService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const parseResult = zGetUserCouponsRequestSchema.safeParse(req.query)
      if (!parseResult.success) {
        const error = { message: 'invalid request query', ...parseResult.error.format() }
        this.logFailure(req, { error })
        const response: IErrorResponse = { message: error.message }
        res.status(400).json(response)
        return
      }
      const result = await this.userCouponService.getUserCoupons(parseResult.data)

      res.status(200).json({ status: 'success', data: result })
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof UserCouponValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IErrorResponse = { message: 'get user coupons validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof UserCouponServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IErrorResponse = { message: 'get user coupons service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected get user coupons error: ${(err as Error).toString()}` })
        const response: IErrorResponse = { message: 'unexpected get user coupons error' }
        res.status(500).json(response)
        return
      }
    }
  }
}
