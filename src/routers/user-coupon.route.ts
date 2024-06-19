import express from 'express'

import { CreateUserCouponController } from '@/controllers/user-coupon/create-user-coupon.controller'
import { DeleteUserCouponsController } from '@/controllers/user-coupon/delete-user-coupons.controller'
import { GetUserCouponsController } from '@/controllers/user-coupon/get-user-coupons.controller'
import { UpdateUserCouponController } from '@/controllers/user-coupon/update-user-coupon.controller'
import { UserCouponService } from '@/modules/user-coupon'

import authMiddleware from '../middlewares/auth.middleware'

const userCouponBaseRoute = `/user-coupons`

const userCouponRoutes = express.Router()

const userCouponService = new UserCouponService()

userCouponRoutes.get(`${userCouponBaseRoute}`, authMiddleware, (req, res, next) => {
  new GetUserCouponsController(userCouponService).handleRequest(req, res).catch((err: unknown) => next(err))
})

userCouponRoutes.post(`${userCouponBaseRoute}`, authMiddleware, (req, res, next) => {
  new CreateUserCouponController(userCouponService).handleRequest(req, res).catch((err: unknown) => next(err))
})

userCouponRoutes.patch(`${userCouponBaseRoute}`, authMiddleware, (req, res, next) => {
  new UpdateUserCouponController(userCouponService).handleRequest(req, res).catch((err: unknown) => next(err))
})

userCouponRoutes.post(`${userCouponBaseRoute}/delete`, authMiddleware, (req, res, next) => {
  new DeleteUserCouponsController(userCouponService).handleRequest(req, res).catch((err: unknown) => next(err))
})

export default userCouponRoutes
