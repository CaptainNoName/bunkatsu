import { relations } from 'drizzle-orm'
import { user } from './users'
import { groups } from './groups'
import { groupMembers } from './group-members'
import { receipts } from './receipts'
import { productAliases } from './product-aliases'

// Users relations (separate file to avoid circular dependencies)
export const usersRelations = relations(user, ({ many }) => ({
  ownedGroups: many(groups),
  groupMemberships: many(groupMembers),
  receipts: many(receipts),
  productAliases: many(productAliases),
}))
