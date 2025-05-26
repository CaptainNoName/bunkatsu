import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { getUserID } from '@/server/user'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/app-sidebar'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const userID = await getUserID()
    return {
      userID,
    }
  },
  loader: ({ context }) => {
    if (!context.userID) {
      throw redirect({ to: '/auth/sign-in' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
        <Toaster richColors />
      </SidebarInset>
    </SidebarProvider>
  )
}
