import { useServerFn } from '@tanstack/react-start'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ScanText } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { If, IfValue, IfValueWith } from '../if'
import { ReceiptView } from './receipt-view'
import { ReceiptLoadingView } from './receipt-loading-view'
import { usePasteImage } from '@/hooks/usePasteImage'
import { scrapeBill } from '@/server/scrapeBill'
import { createReceipt } from '@/server/receipt'

export const ReceiptScan = () => {
  const { pastedImage, clearImage } = usePasteImage()

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const scrapeBillFn = useServerFn(scrapeBill)
  const createReceiptFn = useServerFn(createReceipt)

  const scan = useMutation({
    mutationFn: scrapeBillFn,
  })

  const createReceiptMutation = useMutation({
    mutationFn: createReceiptFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] })
      navigate({ to: '/dashboard/expenses' })
      toast.success('Poprawnie dodano paragon')
    },
    onError: (error) => {
      console.error('Błąd podczas zapisywania paragonu:', error)
      toast.error('Nie udało się dodać paragonu')
    },
  })

  return (
    <Card className="h-[1000px] p-4">
      <If condition={!pastedImage}>
        <div className="w-full h-full flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <ScanText className="size-30 text-muted-foreground" />
            <p className="text-2xl font-bold text-muted-foreground">
              Wybierz plik lub uźyj skrótu klawiszowego by dodać paragon
            </p>
          </div>
        </div>
      </If>
      <IfValueWith
        value={pastedImage}
        condition={!scan.isPending && !scan.isSuccess}
      >
        {(data) => (
          <div className="w-full h-full flex justify-center items-center relative">
            <img src={data} alt="Pasted image" className="max-h-full" />
            <div className="absolute bottom-0 left-0 w-full h-full bg-black/70 flex justify-center items-center flex-col gap-4">
              <p className="text-3xl font-bold">
                Chcesz zeskanować ten paragon?
              </p>
              <div className="flex gap-2">
                <Button
                  size="lg"
                  onClick={() => scan.mutate({ data: pastedImage })}
                >
                  Tak
                </Button>
                <Button size="lg" onClick={clearImage}>
                  Nie
                </Button>
              </div>
            </div>
          </div>
        )}
      </IfValueWith>

      <If condition={scan.isPending || scan.isSuccess}>
        <div className="grid grid-cols-2 w-full h-full gap-6 items-center">
          <img src={pastedImage!} alt="Pasted image" className="max-h-full" />
          <If condition={scan.isPending}>
            <ReceiptLoadingView />
          </If>
          <IfValue value={scan.data}>
            {(data) => (
              <ReceiptView
                data={data}
                onSubmit={() => createReceiptMutation.mutate({ data })}
              />
            )}
          </IfValue>
        </div>
      </If>
    </Card>
  )
}
