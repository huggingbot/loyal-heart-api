import express from 'express'

import { CreateCouponController } from '@/controllers/coupon/create-coupon.controller'
import { DeleteCouponsController } from '@/controllers/coupon/delete-coupons.controller'
import { UpdateCouponController } from '@/controllers/coupon/update-coupon.controller'

import { GetCouponsController } from '../controllers/coupon/get-coupons.controller'
import authMiddleware from '../middlewares/auth.middleware'
import { CouponService } from '../modules/coupon'

const couponBaseRoute = `/coupons`

const couponRoutes = express.Router()

const couponService = new CouponService()

couponRoutes.get(`${couponBaseRoute}`, authMiddleware, (req, res, next) => {
  new GetCouponsController(couponService).handleRequest(req, res).catch((err: unknown) => next(err))
})

couponRoutes.post(`${couponBaseRoute}`, authMiddleware, (req, res, next) => {
  new CreateCouponController(couponService).handleRequest(req, res).catch((err: unknown) => next(err))
})

couponRoutes.patch(`${couponBaseRoute}`, authMiddleware, (req, res, next) => {
  new UpdateCouponController(couponService).handleRequest(req, res).catch((err: unknown) => next(err))
})

couponRoutes.post(`${couponBaseRoute}/delete`, authMiddleware, (req, res, next) => {
  new DeleteCouponsController(couponService).handleRequest(req, res).catch((err: unknown) => next(err))
})

export default couponRoutes
