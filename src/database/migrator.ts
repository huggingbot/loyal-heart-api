import dotenv from 'dotenv'
import { promises as fs } from 'fs'
import { FileMigrationProvider, Migrator } from 'kysely'
import * as path from 'path'

const envPath = path.resolve('.', '.env')

dotenv.config({
  path: envPath,
})

import { logger } from '@/logger'

import { initDb } from './db'

logger.setLevel('debug')

const migrateToLatest = async () => {
  logger.debug('Running migrations')

  const db = initDb()

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      logger.debug(`Migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      logger.error(`Failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    logger.error('Failed to migrate')
    logger.error(String(error))
    process.exit(1)
  }
  logger.debug('Migrations complete')
}

migrateToLatest()
