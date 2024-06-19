import { db } from '@/database/db'

import { BaseService } from '../common'
import { CouponValidationError } from './errors'
import { zCreateCouponSchema, zDeleteCouponsRequestSchema, zGetCouponsRequestSchema, zUpdateCouponSchema } from './schema'

export class CouponService extends BaseService {
  constructor() {
    super('COUPON_SERVICE')
  }

  public async getCoupons(data: Record<string, unknown>) {
    const result = zGetCouponsRequestSchema.safeParse(data)
    if (!result.success) {
      const validationErrors = result.error.format()
      this.logError(`invalid data: ${JSON.stringify(validationErrors)}`)
      throw new CouponValidationError('invalid data', validationErrors)
    }
    const coupons = await db
      .selectFrom('coupon')
      .select(['id', 'partnerId', 'code', 'type', 'value'])
      .where('partnerId', '=', result.data.partnerId)
      .execute()
    return coupons
  }

  public async addCoupon(data: Record<string, unknown>): Promise<void> {
    const result = zCreateCouponSchema.safeParse(data)
    if (!result.success) {
      const validationErrors = result.error.format()
      this.logError(`invalid data: ${JSON.stringify(validationErrors)}`)
      throw new CouponValidationError('invalid data', validationErrors)
    }
    await db.transaction().execute(async (tx) => {
      const insertResult = await tx.insertInto('coupon').values(result.data).executeTakeFirstOrThrow()
      const jsonString = JSON.stringify(insertResult, (_, v: unknown) => (typeof v === 'bigint' ? v.toString() : v))
      this.logInfo(`created coupon: ${jsonString}`)
    })
  }

  public async updateCoupon(data: Record<string, unknown>): Promise<void> {
    const result = zUpdateCouponSchema.safeParse(data)
    if (!result.success) {
      const validationErrors = result.error.format()
      this.logError(`invalid data: ${JSON.stringify(validationErrors)}`)
      throw new CouponValidationError('invalid data', validationErrors)
    }
    await db.transaction().execute(async (tx) => {
      const updateResult = await tx.updateTable('coupon').set(result.data).where('id', '=', result.data.id).executeTakeFirstOrThrow()
      const jsonString = JSON.stringify(updateResult, (_, v: unknown) => (typeof v === 'bigint' ? v.toString() : v))
      this.logInfo(`updated coupon: ${jsonString}`)
    })
  }

  public async deleteCoupons(data: Record<string, unknown>): Promise<void> {
    const result = zDeleteCouponsRequestSchema.safeParse(data)
    if (!result.success) {
      const validationErrors = result.error.format()
      this.logError(`invalid data: ${JSON.stringify(validationErrors)}`)
      throw new CouponValidationError('invalid data', validationErrors)
    }
    await db.transaction().execute(async (tx) => {
      const deleteResult = await tx.deleteFrom('coupon').where('id', 'in', result.data.ids).executeTakeFirstOrThrow()
      const jsonString = JSON.stringify(deleteResult, (_, v: unknown) => (typeof v === 'bigint' ? v.toString() : v))
      this.logInfo(`deleted coupons: ${jsonString}`)
    })
  }
}
