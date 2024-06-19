import { db } from '@/database/db'

import { BaseService } from '../common'
import { UserValidationError } from './errors'
import { zCreateUserSchema, zDeleteUsersRequestSchema, zGetUsersRequestSchema, zUpdateUserSchema } from './schema'

export class UserService extends BaseService {
  constructor() {
    super('USER_SERVICE')
  }

  public async getUsers(data: Record<string, unknown>) {
    const result = zGetUsersRequestSchema.safeParse(data)
    if (!result.success) {
      const validationErrors = result.error.format()
      this.logError(`invalid data: ${JSON.stringify(validationErrors)}`)
      throw new UserValidationError('invalid data', validationErrors)
    }
    const users = await db
      .selectFrom('user')
      .select(['id', 'partnerId', 'name', 'phoneNumber'])
      .where('partnerId', '=', result.data.partnerId)
      .execute()
    return users
  }

  public async addUser(data: Record<string, unknown>): Promise<void> {
    const result = zCreateUserSchema.safeParse(data)
    if (!result.success) {
      const validationErrors = result.error.format()
      this.logError(`invalid data: ${JSON.stringify(validationErrors)}`)
      throw new UserValidationError('invalid data', validationErrors)
    }
    await db.transaction().execute(async (tx) => {
      const insertResult = await tx.insertInto('user').values(result.data).executeTakeFirstOrThrow()
      const jsonString = JSON.stringify(insertResult, (_, v: unknown) => (typeof v === 'bigint' ? v.toString() : v))
      this.logInfo(`created user: ${jsonString}`)
    })
  }

  public async updateUser(data: Record<string, unknown>): Promise<void> {
    const result = zUpdateUserSchema.safeParse(data)
    if (!result.success) {
      const validationErrors = result.error.format()
      this.logError(`invalid data: ${JSON.stringify(validationErrors)}`)
      throw new UserValidationError('invalid data', validationErrors)
    }
    await db.transaction().execute(async (tx) => {
      const updateResult = await tx.updateTable('user').set(result.data).where('id', '=', result.data.id).executeTakeFirstOrThrow()
      const jsonString = JSON.stringify(updateResult, (_, v: unknown) => (typeof v === 'bigint' ? v.toString() : v))
      this.logInfo(`updated user: ${jsonString}`)
    })
  }

  public async deleteUsers(data: Record<string, unknown>): Promise<void> {
    const result = zDeleteUsersRequestSchema.safeParse(data)
    if (!result.success) {
      const validationErrors = result.error.format()
      this.logError(`invalid data: ${JSON.stringify(validationErrors)}`)
      throw new UserValidationError('invalid data', validationErrors)
    }
    await db.transaction().execute(async (tx) => {
      const deleteResult = await tx.deleteFrom('user').where('id', 'in', result.data.ids).executeTakeFirstOrThrow()
      const jsonString = JSON.stringify(deleteResult, (_, v: unknown) => (typeof v === 'bigint' ? v.toString() : v))
      this.logInfo(`deleted users: ${jsonString}`)
    })
  }
}
