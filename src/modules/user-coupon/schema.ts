import { z } from 'zod'

export const zGetUserCouponsRequestSchema = z.object({
  partnerId: z.coerce.number(),
})

export const zCreateUserCouponSchema = z.object({
  partnerId: z.coerce.number(),
  phoneNumber: z.string(),
  code: z.string(),
})

export const zUpdateUserCouponSchema = z.object({
  id: z.coerce.number(),
  redeemedAt: z
    .string()
    .or(z.date())
    .nullable()
    .optional()
    .refine((value) => {
      if (!value || value instanceof Date) {
        return true
      }
      const date = new Date(value)
      return date instanceof Date && !isNaN(date.getTime())
    })
    .transform((value) => {
      if (!value) {
        return null
      }
      if (value instanceof Date) {
        return value
      }
      return new Date(value)
    }),
})

export const zDeleteUserCouponsRequestSchema = z.object({
  ids: z.array(z.coerce.number()),
})
