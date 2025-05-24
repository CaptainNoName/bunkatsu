import { Button } from './ui/button'
import { Separator } from './ui/separator'
import type { ExtractSchemaType } from '@/server/scrapeBill'

type ReceiptViewProps = {
  data: ExtractSchemaType
  onSubmit: () => void
}

export const ReceiptView = ({ data, onSubmit }: ReceiptViewProps) => {
  return (
    <div className="w-full min-h-full max-h-full grid grid-rows-[auto_1fr_auto] gap-5">
      <div>
        <p className="text-2xl font-bold">{data.businessName}</p>
        <p className="text-sm text-foreground-muted">{data.date}</p>
        <Separator className="my-2" />
      </div>
      <div className="overflow-y-auto ">
        {data.items.map((item) => (
          <div className="flex justify-between mb-2">
            <div>
              <p className="font-bold">{item.name}</p>
              <p className="text-sm text-foreground-muted">{item.code}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">{item.price} zł</p>
              <p className="text-sm text-foreground-muted">
                {item.quantity} x {item.unitPrice} zł
              </p>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={onSubmit}>Zatwierdź</Button>
    </div>
  )
}
