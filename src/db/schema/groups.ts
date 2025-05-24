import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
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
