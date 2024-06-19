import { db } from '@/database/db'

import { BaseService } from '../common'
import { UserCouponValidationError } from './errors'
import { zCreateUserCouponSchema, zDeleteUserCouponsRequestSchema, zGetUserCouponsRequestSchema, zUpdateUserCouponSchema } from './schema'

export class UserCouponService extends BaseService {
  constructor() {
    super('USER_COUPON_SERVICE')
  }

  public async getUserCoupons(data: Record<string, unknown>) {
    const result = zGetUserCouponsRequestSchema.safeParse(data)
    if (!result.success) {
      const validationErrors = result.error.format()
      this.logError(`invalid data: ${JSON.stringify(validationErrors)}`)
      throw new UserCouponValidationError('invalid data', validationErrors)
    }
    const userCoupons = await db
      .selectFrom('userCoupon')
      .leftJoin('user', (join) => join.onRef('user.id', '=', 'userCoupon.userId'))
      .leftJoin('coupon', (join) => join.onRef('coupon.id', '=', 'userCoupon.couponId'))
      .where('user.partnerId', '=', result.data.partnerId)
      .where('coupon.partnerId', '=', result.data.partnerId)
      .select(['userCoupon.id', 'user.name', 'user.phoneNumber', 'coupon.code', 'userCoupon.redeemedAt'])
      .execute()
    return userCoupons
  }

  public async addUserCoupon(data: Record<string, unknown>): Promise<void> {
    const result = zCreateUserCouponSchema.safeParse(data)
    if (!result.success) {
      const validationErrors = result.error.format()
      this.logError(`invalid data: ${JSON.stringify(validationErrors)}`)
      throw new UserCouponValidationError('invalid data', validationErrors)
    }
    await db.transaction().execute(async (tx) => {
      const user = await tx
        .selectFrom('user')
        .select(['id'])
        .where('partnerId', '=', result.data.partnerId)
        .where('phoneNumber', '=', result.data.phoneNumber)
        .executeTakeFirstOrThrow()
      const coupon = await tx
        .selectFrom('coupon')
        .select(['id'])
        .where('partnerId', '=', result.data.partnerId)
        .where('code', '=', result.data.code)
        .executeTakeFirstOrThrow()
      const insertResult = await tx
        .insertInto('userCoupon')
        .values({ userId: user.id, couponId: coupon.id, redeemedAt: new Date() })
        .executeTakeFirstOrThrow()

      const jsonString = JSON.stringify(insertResult, (_, v: unknown) => (typeof v === 'bigint' ? v.toString() : v))
      this.logInfo(`created user coupon: ${jsonString}`)
    })
  }

  public async updateUserCoupon(data: Record<string, unknown>): Promise<void> {
    const result = zUpdateUserCouponSchema.safeParse(data)
    if (!result.success) {
      const validationErrors = result.error.format()
      this.logError(`invalid data: ${JSON.stringify(validationErrors)}`)
      throw new UserCouponValidationError('invalid data', validationErrors)
    }
    await db.transaction().execute(async (tx) => {
      const updateResult = await tx.updateTable('userCoupon').set(result.data).where('id', '=', result.data.id).executeTakeFirstOrThrow()
      const jsonString = JSON.stringify(updateResult, (_, v: unknown) => (typeof v === 'bigint' ? v.toString() : v))
      this.logInfo(`updated user coupon: ${jsonString}`)
    })
  }

  public async deleteUserCoupons(data: Record<string, unknown>): Promise<void> {
    const result = zDeleteUserCouponsRequestSchema.safeParse(data)
    if (!result.success) {
      const validationErrors = result.error.format()
      this.logError(`invalid data: ${JSON.stringify(validationErrors)}`)
      throw new UserCouponValidationError('invalid data', validationErrors)
    }
    await db.transaction().execute(async (tx) => {
      const deleteResult = await tx.deleteFrom('userCoupon').where('id', 'in', result.data.ids).executeTakeFirstOrThrow()
      const jsonString = JSON.stringify(deleteResult, (_, v: unknown) => (typeof v === 'bigint' ? v.toString() : v))
      this.logInfo(`deleted user coupons: ${jsonString}`)
    })
  }
}
