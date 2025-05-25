import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'
import { usePasteImage } from '@/hooks/usePasteImage'
import { scrapeBill } from '@/server/scrapeBill'
import { ReceiptView } from '@/components/receipt/receipt-view'
import { Button } from '@/components/ui/button'
import { If, IfValue } from '@/components/if'
import { ReceiptLoadingView } from '@/components/receipt/receipt-loading-view'
import { createReceipt } from '@/server/receipt'

export const Route = createFileRoute('/dashboard/receipts/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const { pastedImage, clearImage } = usePasteImage()

  const scrapeBillFn = useServerFn(scrapeBill)
  const createReceiptFn = useServerFn(createReceipt)

  const mutation = useMutation({
    mutationFn: scrapeBillFn,
  })

  const createReceiptMutation = useMutation({
    mutationFn: createReceiptFn,
    onSuccess: () => {
      toast.success('Poprawnie dodano paragon')
    },
    onError: (error) => {
      console.error('Błąd podczas zapisywania paragonu:', error)
      toast.error('Nie udało się dodać paragonu')
    },
  })

  if (pastedImage)
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex gap-10 h-[1000px]">
          <img
            src={pastedImage}
            alt="Pasted image"
            className="max-w-full max-h-screen rounded-lg"
          />

          <div className="h-full min-w-2xl ">
            <If condition={!mutation.data && !mutation.isPending}>
              <div className="flex flex-col justify-center h-full">
                <h1 className="text-2xl font-bold my-5">
                  Czy to na pewno ten paragon?
                </h1>
                <div className="flex gap-2">
                  <Button
                    onClick={() => mutation.mutate({ data: pastedImage })}
                  >
                    Zatwierdź
                  </Button>
                  <Button onClick={clearImage} variant="outline">
                    Anuluj
                  </Button>
                </div>
              </div>
            </If>
            <If condition={mutation.isPending}>
              <ReceiptLoadingView />
            </If>
            <IfValue value={mutation.data}>
              {(data) => (
                <ReceiptView
                  data={data}
                  onSubmit={() => createReceiptMutation.mutate({ data })}
                />
              )}
            </IfValue>
          </div>
        </div>
      </div>
    )

  return (
    <div className="h-full flex justify-center items-center">
      Wklej paragon albo kliknij aby dodać plik
    </div>
  )
}
