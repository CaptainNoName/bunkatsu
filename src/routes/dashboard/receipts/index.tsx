import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ReceiptText, ShoppingBasket } from 'lucide-react'
import type { ReceiptWithItems } from '@/db/schema'
import type { DateRange } from 'react-day-picker'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getReceiptsQueryOptions } from '@/server/receipt'
import { ReceiptCard } from '@/components/receipt/receipt-card'
import { ReceiptItem } from '@/components/receipt/receipt-item'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/date-range'
import { If } from '@/components/if'

export const Route = createFileRoute('/dashboard/receipts/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getReceiptsQueryOptions())
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data: receipts } = useSuspenseQuery(getReceiptsQueryOptions())
  const [selectedReceipt, setSelectedReceipt] =
    useState<ReceiptWithItems | null>(null)

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
        <p className="text-2xl font-bold">Paragony</p>
        <div className="flex items-center gap-2">
          <DateRangePicker date={dateRange} setDate={setDateRange} />
          <Button asChild>
            <Link to="/dashboard/receipts/create">Dodaj</Link>
          </Button>
        </div>
      </header>
      <div className="h-full max-h-[calc(100dvh-16px)] grid grid-cols-5 divide-x divide-accent-foreground-muted">
        <If condition={!!receipts.length}>
          <ScrollArea className="h-full min-h-0 p-4">
            {receipts.map((receipt: ReceiptWithItems) => (
              <ReceiptCard
                key={receipt.id}
                receipt={receipt}
                selectedReceipt={selectedReceipt}
                setSelectedReceipt={setSelectedReceipt}
              />
            ))}
          </ScrollArea>
        </If>
        <If condition={!receipts.length}>
          <div className="h-full w-full flex justify-center items-center">
            <div className="flex flex-col items-center gap-2">
              <ReceiptText className="size-18 text-muted-foreground" />
              <p className="text-center text-muted-foreground font-medium">
                Brak paragonów w wybranym okresie
              </p>
            </div>
          </div>
        </If>
        <If condition={!!selectedReceipt}>
          <ScrollArea className="h-full min-h-0">
            <div className="p-4 flex flex-col gap-2 divide-y divide-accent-foreground-muted">
              {selectedReceipt?.items.map((item) => (
                <ReceiptItem key={item.id} item={item} />
              ))}
            </div>
          </ScrollArea>
        </If>
        <If condition={!selectedReceipt}>
          <div className="h-full w-full flex justify-center items-center">
            <div className="flex flex-col items-center gap-2">
              <ShoppingBasket className="size-20 text-muted-foreground" />
              <p className="text-center text-muted-foreground font-medium">
                Wybierz paragon aby wyświetlić produkty
              </p>
            </div>
          </div>
        </If>
        <div className="min-h-0 p-4"></div>
      </div>
    </>
  )
}
