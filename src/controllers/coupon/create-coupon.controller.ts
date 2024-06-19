import express from 'express'

import { zCreateCouponSchema } from '@/modules/coupon/schema'

import { CouponService, CouponServiceException, CouponValidationError } from '../../modules/coupon'
import { IErrorResponse } from '../../types'
import { BaseController } from '../common'

export class CreateCouponController extends BaseController {
  private couponService: CouponService

  public constructor(couponService: CouponService) {
    super('CREATE_COUPON_CONTROLLER')
    this.couponService = couponService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const result = zCreateCouponSchema.safeParse(req.body)
      if (!result.success) {
        const error = { message: 'invalid request body', ...result.error.format() }
        this.logFailure(req, { error })
        const response: IErrorResponse = { message: error.message }
        res.status(400).json(response)
        return
      }
      await this.couponService.addCoupon(result.data)

      res.status(200).json({ status: 'success' })
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof CouponValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IErrorResponse = { message: 'create coupon validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof CouponServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IErrorResponse = { message: 'create coupon service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected create coupon error: ${(err as Error).toString()}` })
        const response: IErrorResponse = { message: 'unexpected create coupon error' }
        res.status(500).json(response)
        return
      }
    }
  }
}
