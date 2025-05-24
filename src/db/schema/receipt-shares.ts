import { integer, pgTable, primaryKey, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { receipts } from './receipts'
import { groups } from './groups'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export const receiptShares = pgTable('receipt_shares', {
  receipt_id: integer('receipt_id')
    .references(() => receipts.id)
    .notNull(),
  group_id: integer('group_id')
    .references(() => groups.id)
    .notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const receiptSharesPk = primaryKey({
  name: 'receipt_shares_pk',
  columns: [receiptShares.receipt_id, receiptShares.group_id],
})

// Relations
export const receiptSharesRelations = relations(receiptShares, ({ one }) => ({
  receipt: one(receipts, {
    fields: [receiptShares.receipt_id],
    references: [receipts.id],
  }),
  group: one(groups, {
    fields: [receiptShares.group_id],
    references: [groups.id],
  }),
}))

// Types
export type ReceiptShare = InferSelectModel<typeof receiptShares>
export type NewReceiptShare = InferInsertModel<typeof receiptShares>
