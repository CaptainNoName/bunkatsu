import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  google_id: varchar('google_id', { length: 255 }).unique(),
  avatar_url: varchar('avatar_url', { length: 500 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

// Types
export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>
