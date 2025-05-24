import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/auth-client'

export const Route = createFileRoute('/auth/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-dvw h-dvh flex justify-center items-center">
      <Button onClick={() => signIn.social({ provider: 'github' })}>
        Github
      </Button>
    </div>
  )
}
