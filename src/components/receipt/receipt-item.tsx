import type { ReceiptItem as ReceiptItemType } from '@/db/schema'

type ReceiptItemProps = {
  item: ReceiptItemType
}

export const ReceiptItem = ({ item }: ReceiptItemProps) => {
  return (
    <div key={item.id} className="flex justify-between items-center pb-2">
      <div>
        <p className="text-sm font-bold">{item.name}</p>
        <p className="text-xs text-foreground-muted">{item.code}</p>
      </div>
      <div>
        <p className="text-sm font-bold">{item.price} zł</p>
        <p className="text-xs text-foreground-muted text-right">
          {item.quantity}
        </p>
      </div>
    </div>
  )
}
