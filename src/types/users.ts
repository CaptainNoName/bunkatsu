import type { User } from '@/db/schema/users'
import type { Group } from '@/db/schema/groups'
import type { GroupMember } from '@/db/schema/group-members'

export type UserWithGroups = User & {
  ownedGroups: Array<Group>
  groupMemberships: Array<GroupMember & { group: Group }>
}
