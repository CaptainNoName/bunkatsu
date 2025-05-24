import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { user } from './users'
import { groups } from './groups'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export const groupMembers = pgTable('group_members', {
  group_id: integer('group_id')
    .references(() => groups.id)
    .notNull(),
  user_id: text('user_id')
    .references(() => user.id)
    .notNull(),
  joined_at: timestamp('joined_at').defaultNow().notNull(),
})

export const groupMembersPk = primaryKey({
  name: 'group_members_pk',
  columns: [groupMembers.group_id, groupMembers.user_id],
})

// Relations
export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.group_id],
    references: [groups.id],
  }),
  user: one(user, {
    fields: [groupMembers.user_id],
    references: [user.id],
  }),
}))

// Types
export type GroupMember = InferSelectModel<typeof groupMembers>
export type NewGroupMember = InferInsertModel<typeof groupMembers>
