import { createServerFn } from '@tanstack/react-start'
import type { ExtractSchemaType } from './scrapeBill'
import {
  receiptInsertSchema,
  receiptItemInsertSchema,
  receiptItems,
  receipts,
} from '@/db/schema'
import { db } from '@/db'

export const createReceipt = createServerFn({ method: 'POST' })
  .validator((data: ExtractSchemaType) => data)
  .handler(async ({ data }) => {
    // TODO: Zastąpić tymczasowym user_id prawdziwym ID z sesji użytkownika
    const tempUserId = 1

    // Transformuj dane z scrapeBill na format bazy i waliduj schematem Drizzle
    const receiptData = receiptInsertSchema.parse({
      business_name: data.businessName || null,
      date: data.date || null,
      total: data.total?.toString() || null,
    })

    // Wrap in transaction to ensure data consistency
    return await db.transaction(async (tx) => {
      // Zapisz paragon do tabeli receipts
      const [receipt] = await tx
        .insert(receipts)
        .values({
          ...receiptData,
          user_id: tempUserId,
        })
        .returning({ id: receipts.id })

      // Zapisz pozycje paragonu do tabeli receipt_items
      if (data.items.length > 0) {
        const itemsToInsert = data.items.map((item) => {
          // Transformuj każdą pozycję i waliduj schematem Drizzle
          return receiptItemInsertSchema.parse({
            receipt_id: receipt.id,
            name: item.name,
            quantity: item.quantity.toString(),
            price: item.price.toString(),
            unit_price: item.unitPrice.toString(),
            code: item.code || null,
          })
        })

        await tx.insert(receiptItems).values(itemsToInsert)
      }

      return { success: true, receiptId: receipt.id }
    })
  })
