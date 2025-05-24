import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { usePasteImage } from '@/hooks/usePasteImage'
import { scrapeBill } from '@/server/scrapeBill'
import { ReceiptView } from '@/components/receipt-view'
import { Button } from '@/components/ui/button'
import { If, IfValue } from '@/components/if'
import { ReceiptLoadingView } from '@/components/receipt-loading-view'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { pastedImage, clearImage } = usePasteImage()

  const scrapeBillFn = useServerFn(scrapeBill)

  const mutation = useMutation({
    mutationFn: scrapeBillFn,
  })

  if (pastedImage)
    return (
      <div className="w-dvw h-dvh flex items-center justify-center">
        <div className="flex gap-10 h-[1000px]">
          <img
            src={pastedImage}
            alt="Pasted image"
            className="max-w-full max-h-screen rounded-lg"
          />

          <div className="h-full min-w-2xl ">
            <If condition={!mutation.data}>
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
              {(data) => <ReceiptView data={data} />}
            </IfValue>
          </div>
        </div>
      </div>
    )

  return (
    <div className="w-dvw h-dvh flex justify-center items-center">
      Wklej paragon albo kliknij aby dodać plik
    </div>
  )
}
