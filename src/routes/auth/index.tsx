import { Navigate, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Navigate to="/auth/sign-in" />
}
