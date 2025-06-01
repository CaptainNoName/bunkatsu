import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import { user } from './users'
import { groupMembers } from './group-members'
import { receiptShares } from './receipt-shares'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  owner_id: text('owner_id')
    .references(() => user.id)
    .notNull(),
  code: varchar('code', { length: 36 })
    .notNull()
    .$default(() => crypto.randomUUID()),
  is_valid: boolean('is_valid').notNull().default(true),
  valid_date: timestamp('valid_date')
    .notNull()
    .$default(() => {
      const date = new Date()
      date.setDate(date.getDate() + 7)
      return date
    }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

// Relations
export const groupsRelations = relations(groups, ({ one, many }) => ({
  owner: one(user, {
    fields: [groups.owner_id],
    references: [user.id],
  }),
  members: many(groupMembers),
  sharedReceipts: many(receiptShares),
}))

// Types
export type Group = InferSelectModel<typeof groups>
export type NewGroup = InferInsertModel<typeof groups>

export const groupInsertSchema = createInsertSchema(groups).omit({
  id: true,
  code: true,
  owner_id: true,
  is_valid: true,
  valid_date: true,
  created_at: true,
  updated_at: true,
})
