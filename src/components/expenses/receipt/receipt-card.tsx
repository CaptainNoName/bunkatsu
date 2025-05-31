import { Card, CardContent } from '../../ui/card'
import type { ReceiptWithItems } from '@/db/schema'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { If, IfValue } from '@/components/if'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
      className={`cursor-pointer transition-all hover:shadow-md ${selectedReceipt?.id === receipt.id ? 'border-primary' : ''} mb-2 py-3`}
      role="button"
      onClick={handleClick}
    >
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-bold">{receipt.business_name}</p>
            <p className="text-xs text-foreground-muted">{receipt.date}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="text-sm font-bold text-right">{receipt.total} zł</p>
            <IfValue value={receipt.payer}>
              {(payer) => (
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={payer.image ?? undefined} />
                      <AvatarFallback>{payer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>{payer.name}</TooltipContent>
                </Tooltip>
              )}
            </IfValue>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
