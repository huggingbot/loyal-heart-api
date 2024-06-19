import type { ColumnType } from 'kysely'

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U> ? ColumnType<S, I | undefined, U> : ColumnType<T, T | undefined, T>

export type Numeric = ColumnType<string, number | string, number | string>

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface Coupon {
  code: string
  createdAt: Generated<Timestamp>
  id: Generated<number>
  maxUsage: number | null
  partnerId: number
  type: string
  updatedAt: Timestamp | null
  usageCount: number | null
  validFrom: Timestamp | null
  validTo: Timestamp | null
  value: Numeric
}

export interface Partner {
  createdAt: Generated<Timestamp>
  id: Generated<number>
  name: string
  updatedAt: Timestamp | null
}

export interface Referral {
  createdAt: Generated<Timestamp>
  id: Generated<number>
  referredId: number
  referrerId: number
  updatedAt: Timestamp | null
}

export interface User {
  createdAt: Generated<Timestamp>
  email: string | null
  id: Generated<number>
  name: string
  partnerId: number
  phoneNumber: string
  role: Generated<string>
  updatedAt: Timestamp | null
}

export interface UserCoupon {
  couponId: number
  createdAt: Generated<Timestamp>
  id: Generated<number>
  redeemedAt: Timestamp | null
  updatedAt: Timestamp | null
  userId: number
}

export interface UserStat {
  createdAt: Generated<Timestamp>
  id: Generated<number>
  purchaseCount: number | null
  updatedAt: Timestamp | null
  userId: number
}

export interface DB {
  coupon: Coupon
  partner: Partner
  referral: Referral
  user: User
  userCoupon: UserCoupon
  userStat: UserStat
}
