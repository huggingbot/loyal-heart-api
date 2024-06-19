import { Kysely, sql } from 'kysely'

import { DB } from '../gen-types'

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable('partner')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp')
    .addColumn('name', 'text', (col) => col.notNull().unique())
    .execute()

  await db.schema
    .createTable('user')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp')
    .addColumn('partner_id', 'integer', (col) => col.notNull().references('partner.id').onDelete('cascade'))
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('phone_number', 'text', (col) => col.notNull())
    .addColumn('email', 'text')
    .addColumn('role', 'text', (col) => col.defaultTo('member').notNull())
    .addUniqueConstraint('user_partner_id_phone_number_unique', ['partner_id', 'phone_number'])
    .addUniqueConstraint('user_partner_id_email_unique', ['partner_id', 'email'])
    .execute()

  await db.schema
    .createTable('coupon')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp')
    .addColumn('partner_id', 'integer', (col) => col.notNull().references('partner.id').onDelete('cascade'))
    .addColumn('code', 'text', (col) => col.notNull())
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('value', 'decimal(8, 2)', (col) => col.notNull())
    .addColumn('usage_count', 'integer')
    .addColumn('max_usage', 'integer')
    .addColumn('valid_from', 'timestamp')
    .addColumn('valid_to', 'timestamp')
    .addUniqueConstraint('coupon_partner_id_code_unique', ['partner_id', 'code'])
    .addCheckConstraint('coupon_usage_count_max_usage_constraint', sql`usage_count <= max_usage OR usage_count IS NULL OR max_usage IS NULL`)
    .addCheckConstraint('coupon_valid_from_valid_to_constraint', sql`valid_from <= valid_to OR valid_from IS NULL OR valid_to IS NULL`)
    .execute()

  await db.schema
    .createTable('user_coupon')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp')
    .addColumn('user_id', 'integer', (col) => col.notNull().references('user.id').onDelete('cascade'))
    .addColumn('coupon_id', 'integer', (col) => col.notNull().references('coupon.id').onDelete('cascade'))
    .addColumn('redeemed_at', 'timestamp')
    .execute()

  await db.schema
    .createTable('user_stat')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp')
    .addColumn('user_id', 'integer', (col) => col.references('user.id').notNull().onDelete('cascade'))
    .addColumn('purchase_count', 'integer')
    .execute()

  await db.schema
    .createTable('referral')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp')
    .addColumn('referrer_id', 'integer', (col) => col.references('user.id').notNull().onDelete('cascade'))
    .addColumn('referred_id', 'integer', (col) => col.references('user.id').notNull().onDelete('cascade'))
    .execute()
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable('referral').execute()
  await db.schema.dropTable('user_stat').execute()
  await db.schema.dropTable('user_coupon').execute()
  await db.schema.dropTable('coupon').execute()
  await db.schema.dropTable('user').execute()
  await db.schema.dropTable('partner').execute()
}
