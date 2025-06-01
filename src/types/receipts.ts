import type { Receipt } from '@/db/schema/receipts'
import type { ReceiptItem } from '@/db/schema/receipt-items'

export type ReceiptWithItems = Receipt & {
  items: Array<ReceiptItem>
  payer: {
    id: string
    name: string
    image: string | null
  }
}
