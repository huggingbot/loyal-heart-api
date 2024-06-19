import { Insertable, Selectable, Updateable } from 'kysely'

import type { DB } from './gen-types'

export type DBSelect = {
  [K in keyof DB]: Selectable<DB[K]>
}

export type DBInsert = {
  [K in keyof DB]: Insertable<DB[K]>
}

export type DBUpdate = {
  [K in keyof DB]: Updateable<DB[K]>
}
