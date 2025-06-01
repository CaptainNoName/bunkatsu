import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { useServerFn } from '@tanstack/react-start'
import { useMutation } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { CopyIcon } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createGroup } from '@/server/group'
import { If } from '@/components/if'
import { env } from '@/env'

export const CreateGroup = () => {
  const createGroupFn = useServerFn(createGroup)
  const [code, setCode] = useState('')

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Link został skopiowany do schowka!')
    } catch (error) {
      console.error('Błąd podczas kopiowania:', error)
      toast.error('Nie udało się skopiować linku')
    }
  }

  const mutation = useMutation({
    mutationFn: createGroupFn,
    onSuccess: (data) => {
      toast.success('Grupa została utworzona pomyślnie!')
      setCode(data.code)
      form.reset()
    },
    onError: (error) => {
      toast.error('Wystąpił błąd podczas tworzenia grupy')
      console.error('Error creating group:', error)
    },
  })

  const formSchema = z.object({
    name: z
      .string()
      .min(2, 'Nazwa musi mieć minimum 2 znaki')
      .max(255, 'Nazwa może mieć maksymalnie 255 znaków'),
    description: z.string().optional(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate({
      data: {
        name: data.name,
        description: data.description || null,
      },
    })
  }

  const link = useMemo(() => {
    return `${env.VITE_FRONTEND_URL}/dashboard/expenses?group_code=${code}`
  }, [code])

  return (
    <>
      <If condition={!code}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Nazwa grupy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Opis grupy"
                      className="mt-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mt-4 w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Tworzenie...' : 'Utwórz'}
            </Button>
          </form>
        </Form>
      </If>
      <If condition={!!code}>
        <div className="flex items-center gap-2">
          <Input value={link} disabled />

          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(link)}
          >
            <CopyIcon />
          </Button>
        </div>
        <span className="text-xs text-muted-foreground ml-3">
          Link jest aktywny przez 7 dni
        </span>
      </If>
    </>
  )
}
