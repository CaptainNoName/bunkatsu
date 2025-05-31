import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { ReceiptText } from 'lucide-react'
import { ScrollArea } from '../../ui/scroll-area'
import { If } from '../../if'
import { ReceiptItem } from './receipt-item'
import { ReceiptCard } from './receipt-card'
import { ReceiptDetails } from './receipt-details'
import type { ReceiptWithItems } from '@/db/schema'
import type { DateRange } from 'react-day-picker'
import { getReceiptsQueryOptions } from '@/server/receipt'
import { Separator } from '@/components/ui/separator'

export const ReceiptWidget = ({
  dateRange,
}: {
  dateRange: DateRange | undefined
}) => {
  const { data: receipts = [] } = useQuery(getReceiptsQueryOptions(dateRange))
  const [selectedReceipt, setSelectedReceipt] =
    useState<ReceiptWithItems | null>(null)

  useEffect(() => {
    setSelectedReceipt(null)
  }, [dateRange])
  return (
    <>
      <If condition={!!receipts.length}>
        <div className="p-4 w-96">
          <p className="text-lg font-bold mb-4">Paragony</p>
          <ScrollArea className="max-h-full min-h-0">
            {receipts.map((receipt: ReceiptWithItems) => (
              <ReceiptCard
                key={receipt.id}
                receipt={receipt}
                selectedReceipt={selectedReceipt}
                setSelectedReceipt={setSelectedReceipt}
              />
            ))}
          </ScrollArea>
        </div>
      </If>
      <If condition={!receipts.length}>
        <div className="h-full w-96 flex justify-center items-center">
          <div className="flex flex-col items-center gap-2">
            <ReceiptText className="size-18 text-muted-foreground" />
            <p className="text-center text-muted-foreground font-medium">
              Brak paragonów w wybranym okresie
            </p>
          </div>
        </div>
      </If>
      <If condition={!!selectedReceipt}>
        <div className="p-4 w-64">
          <ReceiptDetails />
          <Separator className="my-2" />
          <p className="text-lg font-bold mb-4">Towary</p>
          <ScrollArea className="max-h-full min-h-0">
            <div className="flex flex-col gap-2 divide-y divide-accent-foreground-muted">
              {selectedReceipt?.items.map((item) => (
                <ReceiptItem key={item.id} item={item} />
              ))}
            </div>
          </ScrollArea>
        </div>
      </If>
    </>
  )
}
