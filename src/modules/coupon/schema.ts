import { z } from 'zod'

export const zGetCouponsRequestSchema = z.object({
  partnerId: z.coerce.number(),
})

export const zCreateCouponSchema = z.object({
  partnerId: z.coerce.number(),
  code: z.string(),
  value: z.number(),
  type: z.string(),
})

export const zUpdateCouponSchema = z.object({
  id: z.coerce.number(),
  partnerId: z.coerce.number().optional(),
  name: z.string().optional(),
  phoneNumber: z.string().optional(),
})

export const zDeleteCouponsRequestSchema = z.object({
  ids: z.array(z.coerce.number()),
})
