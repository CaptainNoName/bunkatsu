import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { getUserID } from '@/server/user'

export const Route = createFileRoute('/auth')({
  beforeLoad: async () => {
    const userID = await getUserID()
    return {
      userID,
    }
  },
  loader: ({ context }) => {
    if (context.userID) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
