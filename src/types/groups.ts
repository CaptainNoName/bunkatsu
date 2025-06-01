import type { User } from '@/db/schema/users'
import type { Group } from '@/db/schema/groups'
import type { GroupMember } from '@/db/schema/group-members'
import type { fetchGroups } from '@/server/group'

export type GroupWithMembers = Group & {
  owner: User
  members: Array<GroupMember & { user: User }>
}

// Automatycznie wyciągnięte typy z server functions
export type FetchGroupsResult = Awaited<ReturnType<typeof fetchGroups>>
export type GroupFromFetch = FetchGroupsResult[0]
