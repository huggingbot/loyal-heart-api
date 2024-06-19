import express from 'express'

import { CouponService, CouponServiceException, CouponValidationError } from '@/modules/coupon'
import { zGetCouponsRequestSchema } from '@/modules/coupon/schema'
import { IErrorResponse } from '@/types'

import { BaseController } from '../common'

export class GetCouponsController extends BaseController {
  private couponService: CouponService

  public constructor(couponService: CouponService) {
    super('GET_COUPONS_CONTROLLER')
    this.couponService = couponService
  }

  public async handleRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const parseResult = zGetCouponsRequestSchema.safeParse(req.query)
      if (!parseResult.success) {
        const error = { message: 'invalid request query', ...parseResult.error.format() }
        this.logFailure(req, { error })
        const response: IErrorResponse = { message: error.message }
        res.status(400).json(response)
        return
      }
      const result = await this.couponService.getCoupons(parseResult.data)

      res.status(200).json({ status: 'success', data: result })
      this.logSuccess(req)
    } catch (err) {
      if (err instanceof CouponValidationError) {
        this.logFailure(req, { error: err.message })
        const response: IErrorResponse = { message: 'get coupons validation error' }
        res.status(400).json(response)
        return
      } else if (err instanceof CouponServiceException) {
        this.logFailure(req, { error: err.message })
        const response: IErrorResponse = { message: 'get coupons service exception' }
        res.status(400).json(response)
        return
      } else {
        this.logFailure(req, { error: `unexpected get coupons error: ${(err as Error).toString()}` })
        const response: IErrorResponse = { message: 'unexpected get coupons error' }
        res.status(500).json(response)
        return
      }
    }
  }
}
