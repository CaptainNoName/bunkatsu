import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, UserRoundMinus } from 'lucide-react'
import { format } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start-client'
import { toast } from 'sonner'
import type { GroupFromFetch } from '@/types/groups'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { removeUserFromGroup } from '@/server/group'

type GroupListProps = {
  groups: Array<GroupFromFetch> | undefined
  currentUserId?: string
}

export const GroupList = ({ groups, currentUserId }: GroupListProps) => {
  const [selectedGroup, setSelectedGroup] = useState<GroupFromFetch | null>(
    null,
  )
  const queryClient = useQueryClient()
  const removeUserFn = useServerFn(removeUserFromGroup)

  const removeUserMutation = useMutation({
    mutationFn: removeUserFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['groups'] })

      if (selectedGroup) {
        const updatedGroup = groups?.find(
          (group) => group.id === selectedGroup.id,
        )
        if (updatedGroup) {
          setSelectedGroup(updatedGroup)
        }
      }

      toast.success('Użytkownik został usunięty z grupy')
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message || 'Wystąpił błąd podczas usuwania użytkownika'
      toast.error(errorMessage)
    },
  })

  const handleRemoveUser = (userId: string) => {
    if (!selectedGroup) return

    removeUserMutation.mutate({
      data: {
        groupId: selectedGroup.id,
        userId: userId,
      },
    })
  }

  return (
    <div className="relative h-48 overflow-y-auto overflow-x-hidden">
      <div
        className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
          selectedGroup ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {!selectedGroup &&
          groups?.map((group, index) => (
            <React.Fragment key={group.id}>
              <div
                key={index}
                className="flex items-center justify-between"
                onClick={() => setSelectedGroup(group)}
              >
                <div className="flex flex-col">
                  <p className="text-sm font-bold">{group.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {group.members.length} osób
                  </p>
                </div>
                <ChevronRight className="h-4" />
              </div>
              <Separator className="my-2" />
            </React.Fragment>
          ))}
      </div>

      <div
        className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
          selectedGroup ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div
            className="flex items-center"
            onClick={() => setSelectedGroup(null)}
          >
            <ChevronLeft className="h-4" />
            <p className="text-base font-bold">{selectedGroup?.name}</p>
          </div>
        </div>

        <div className="h-40 overflow-y-auto">
          {selectedGroup?.members.map((member) => (
            <div
              key={member.user.id}
              className="mt-4 flex items-center gap-2 justify-between"
            >
              <div className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarImage
                    src={member.user.image ?? ''}
                    alt={member.user.name}
                  />
                  <AvatarFallback>
                    {member.user.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-bold">{member.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(member.joined_at, 'dd.MM.yyyy HH:mm')}
                  </p>
                </div>
              </div>
              {selectedGroup.owner_id === currentUserId && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveUser(member.user.id)}
                >
                  <UserRoundMinus className="h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
