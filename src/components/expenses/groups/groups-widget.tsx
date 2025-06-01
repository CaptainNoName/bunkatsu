import { useQuery } from '@tanstack/react-query'
import { CreateGroup } from './create-group'
import { GroupList } from './group-list'
import { fetchGroupsQueryOptions } from '@/server/group'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const GroupsWidget = () => {
  const { data: groups = [] } = useQuery(fetchGroupsQueryOptions)

  return (
    <Card>
      <CardContent>
        <Tabs defaultValue="list">
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-lg font-bold">Grupy</CardTitle>
            <TabsList>
              <TabsTrigger value="list" className="text-xs py-1">
                Lista
              </TabsTrigger>
              <TabsTrigger value="create" className="text-xs py-1">
                Dodawanie
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="list">
            <GroupList groups={groups} />
          </TabsContent>
          <TabsContent value="create">
            <CreateGroup />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
