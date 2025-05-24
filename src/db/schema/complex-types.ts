import type { User } from './users'
import type { Group } from './groups'
import type { GroupMember } from './group-members'
import type { Receipt } from './receipts'
import type { ReceiptItem } from './receipt-items'

// Complex types for commonly used data structures
export type ReceiptWithItems = Receipt & {
  items: Array<ReceiptItem>
}

export type GroupWithMembers = Group & {
  owner: User
  members: Array<GroupMember & { user: User }>
}

export type UserWithGroups = User & {
  ownedGroups: Array<Group>
  groupMemberships: Array<GroupMember & { group: Group }>
}
