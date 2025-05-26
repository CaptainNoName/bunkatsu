import { Card, CardContent } from '../ui/card'
import type { ReceiptWithItems } from '@/db/schema'

type ReceiptCardProps = {
  receipt: ReceiptWithItems
  selectedReceipt: ReceiptWithItems | null
  setSelectedReceipt: (receipt: ReceiptWithItems | null) => void
}

export const ReceiptCard = ({
  receipt,
  selectedReceipt,
  setSelectedReceipt,
}: ReceiptCardProps) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    const value = selectedReceipt?.id === receipt.id ? null : receipt
    setSelectedReceipt(value)
  }
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${selectedReceipt?.id === receipt.id ? 'border-primary' : ''}`}
      role="button"
      onClick={handleClick}
    >
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-bold">{receipt.business_name}</p>
            <p className="text-xs text-foreground-muted">{receipt.date}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-right">{receipt.total} zł</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
