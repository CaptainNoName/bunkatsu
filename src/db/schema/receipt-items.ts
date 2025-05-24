import {
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { relations } from 'drizzle-orm'
import { receipts } from './receipts'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export const receiptItems = pgTable('receipt_items', {
  id: serial('id').primaryKey(),
  receipt_id: integer('receipt_id')
    .references(() => receipts.id)
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  quantity: numeric('quantity', { precision: 10, scale: 3 }).notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(), // total cost for quantity
  unit_price: numeric('unit_price', { precision: 10, scale: 2 }).notNull(), // price per unit
  code: varchar('code', { length: 100 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

// Relations
export const receiptItemsRelations = relations(receiptItems, ({ one }) => ({
  receipt: one(receipts, {
    fields: [receiptItems.receipt_id],
    references: [receipts.id],
  }),
}))

// Types
export type ReceiptItem = InferSelectModel<typeof receiptItems>
export type NewReceiptItem = InferInsertModel<typeof receiptItems>

export const receiptItemInsertSchema = createInsertSchema(receiptItems)
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
  })
  .refine(
    (data) => {
      const calculatedPrice = Number(data.unit_price) * Number(data.quantity)
      return Math.abs(Number(data.price) - calculatedPrice) < 0.01 // Allow for small rounding differences
    },
    {
      message: 'Price must equal unit_price * quantity',
      path: ['price'],
    },
  )
