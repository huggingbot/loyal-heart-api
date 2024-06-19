import { z } from 'zod'

export const zGetUsersRequestSchema = z.object({
  partnerId: z.coerce.number(),
})

export const zCreateUserSchema = z.object({
  partnerId: z.coerce.number(),
  name: z.string(),
  phoneNumber: z.string(),
})

export const zUpdateUserSchema = z.object({
  id: z.coerce.number(),
  partnerId: z.coerce.number().optional(),
  name: z.string().optional(),
  phoneNumber: z.string().optional(),
})

export const zDeleteUsersRequestSchema = z.object({
  ids: z.array(z.coerce.number()),
})
