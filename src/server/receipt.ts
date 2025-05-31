import { createServerFn } from '@tanstack/react-start'
import { and, eq, gte, lte, sum } from 'drizzle-orm'
import { queryOptions } from '@tanstack/react-query'
import type { ExtractSchemaType } from './scrapeBill'
import type { DateRange } from 'react-day-picker'
import {
  receiptInsertSchema,
  receiptItemInsertSchema,
  receiptItems,
  receipts,
} from '@/db/schema'
import { db } from '@/db'
import { authMiddleware } from '@/lib/auth-middleware'

export const createReceipt = createServerFn({ method: 'POST' })
  .validator((data: ExtractSchemaType) => data)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const userId = context.user.id
    if (!userId) {
      throw new Error('User ID is required')
    }
    const receiptData = receiptInsertSchema.parse({
      business_name: data.businessName || null,
      date: data.date || null,
      total: data.total?.toString() || null,
    })

    return await db.transaction(async (tx) => {
      const [receipt] = await tx
        .insert(receipts)
        .values({
          ...receiptData,
          user_id: userId,
          paid_by: userId,
        })
        .returning({ id: receipts.id })

      if (data.items.length > 0) {
        const itemsToInsert = data.items.map((item) => {
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

export const getReceipts = createServerFn({ method: 'GET' })
  .validator((data: { from?: string; to?: string }) => data)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const userId = context.user.id
    if (!userId) {
      throw new Error('User ID is required')
    }

    const conditions = [eq(receipts.user_id, userId)]

    if (data.from) {
      conditions.push(gte(receipts.date, data.from))
    }

    if (data.to) {
      conditions.push(lte(receipts.date, data.to))
    }

    const queriedReceipts = await db.query.receipts.findMany({
      where: and(...conditions),
      with: {
        items: true,
        payer: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: (receipt, { desc }) => [desc(receipt.date)],
    })
    return queriedReceipts
  })

export const getReceiptsQueryOptions = (dateRange?: DateRange) => {
  const from = dateRange?.from?.toISOString().split('T')[0]
  const to = dateRange?.to?.toISOString().split('T')[0]

  return queryOptions({
    queryKey: ['receipts', from, to],
    queryFn: () => getReceipts({ data: { from, to } }),
    staleTime: 5 * 60 * 1000,
  })
}

export const getReceiptsTotal = createServerFn({ method: 'GET' })
  .validator((data: { from?: string; to?: string }) => data)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const userId = context.user.id
    if (!userId) {
      throw new Error('User ID is required')
    }

    const conditions = [eq(receipts.user_id, userId)]

    if (data.from) {
      conditions.push(gte(receipts.date, data.from))
    }

    if (data.to) {
      conditions.push(lte(receipts.date, data.to))
    }

    const result = await db
      .select({
        total: sum(receipts.total),
      })
      .from(receipts)
      .where(and(...conditions))

    return Number(result[0]?.total || 0)
  })

export const getReceiptsTotalQueryOptions = (dateRange?: DateRange) => {
  const from = dateRange?.from?.toISOString().split('T')[0]
  const to = dateRange?.to?.toISOString().split('T')[0]

  return queryOptions({
    queryKey: ['receipts-total', from, to],
    queryFn: () => getReceiptsTotal({ data: { from, to } }),
    staleTime: 5 * 60 * 1000,
  })
}
