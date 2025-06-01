import { createServerFn } from '@tanstack/react-start'
import { and, desc, eq, inArray } from 'drizzle-orm'
import { z } from 'zod'
import { queryOptions } from '@tanstack/react-query'
import { groupInsertSchema, groups } from '@/db/schema/groups'
import { groupMembers } from '@/db/schema/group-members'
import { authMiddleware } from '@/lib/auth-middleware'
import { db } from '@/db'

export const createGroup = createServerFn({
  method: 'POST',
})
  .validator((data) => groupInsertSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const userId = context.user.id
    if (!userId) {
      throw new Error('User not authenticated')
    }

    // Użyj transakcji żeby stworzyć grupę i dodać ownera jako członka
    const result = await db.transaction(async (tx) => {
      // Stwórz grupę
      const group = await tx
        .insert(groups)
        .values({
          ...data,
          owner_id: userId,
        })
        .returning()

      const createdGroup = group[0]

      // Dodaj ownera jako członka grupy
      await tx.insert(groupMembers).values({
        group_id: createdGroup.id,
        user_id: userId,
      })

      return createdGroup
    })

    return result
  })

export const fetchGroups = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.user.id
    if (!userId) {
      throw new Error('User not authenticated')
    }

    const userMemberships = await db
      .select({ group_id: groupMembers.group_id })
      .from(groupMembers)
      .where(eq(groupMembers.user_id, userId))

    const groupIds = userMemberships.map((m) => m.group_id)

    if (groupIds.length === 0) {
      return []
    }

    const userGroups = await db.query.groups.findMany({
      where: inArray(groups.id, groupIds),
      orderBy: [desc(groups.created_at)],
      columns: {
        id: true,
        name: true,
        description: true,
        owner_id: true,
        created_at: true,
      },
      with: {
        owner: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
        members: {
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          columns: {
            joined_at: true,
          },
        },
      },
    })

    return userGroups
  })

export const fetchGroupsQueryOptions = queryOptions({
  queryKey: ['groups'],
  queryFn: fetchGroups,
})

export const removeUserFromGroup = createServerFn({
  method: 'POST',
})
  .validator((data) =>
    z
      .object({
        groupId: z.number(),
        userId: z.string(),
      })
      .parse(data),
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const currentUserId = context.user.id
    if (!currentUserId) {
      throw new Error('User not authenticated')
    }

    // Sprawdź czy obecny użytkownik jest właścicielem grupy
    const group = await db.query.groups.findFirst({
      where: eq(groups.id, data.groupId),
      columns: {
        owner_id: true,
      },
    })

    if (!group) {
      throw new Error('Grupa nie została znaleziona')
    }

    if (group.owner_id !== currentUserId) {
      throw new Error('Tylko właściciel grupy może usuwać członków')
    }

    // Nie pozwól właścicielowi usunąć samego siebie
    if (data.userId === currentUserId) {
      throw new Error('Właściciel grupy nie może usunąć samego siebie')
    }

    // Usuń użytkownika z grupy
    await db
      .delete(groupMembers)
      .where(
        and(
          eq(groupMembers.group_id, data.groupId),
          eq(groupMembers.user_id, data.userId),
        ),
      )

    return { success: true }
  })
