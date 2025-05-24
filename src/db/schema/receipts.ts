import {
  date,
  integer,
  numeric,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { relations } from 'drizzle-orm'
import { users } from './users'
import { receiptItems } from './receipt-items'
import { receiptShares } from './receipt-shares'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export const receipts = pgTable('receipts', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id')
    .references(() => users.id)
    .notNull(),
  business_name: varchar('business_name', { length: 255 }),
  date: date('date'), // Data paragonu
  total: numeric('total', { precision: 10, scale: 2 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

// Relations
export const receiptsRelations = relations(receipts, ({ one, many }) => ({
  user: one(users, {
    fields: [receipts.user_id],
    references: [users.id],
  }),
  items: many(receiptItems),
  shares: many(receiptShares),
}))

// Types
export type Receipt = InferSelectModel<typeof receipts>
export type NewReceipt = InferInsertModel<typeof receipts>

export const receiptInsertSchema = createInsertSchema(receipts).omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
})
