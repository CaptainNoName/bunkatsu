import {
  date,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { relations } from 'drizzle-orm'
import { user } from './users'
import { receiptItems } from './receipt-items'
import { receiptShares } from './receipt-shares'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export const receipts = pgTable('receipts', {
  id: serial('id').primaryKey(),
  user_id: text('user_id')
    .references(() => user.id)
    .notNull(),
  paid_by: text('paid_by')
    .references(() => user.id)
    .notNull(),
  business_name: varchar('business_name', { length: 255 }),
  date: date('date'),
  total: numeric('total', { precision: 10, scale: 2 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

// Relations
export const receiptsRelations = relations(receipts, ({ one, many }) => ({
  user: one(user, {
    fields: [receipts.user_id],
    references: [user.id],
  }),
  payer: one(user, {
    fields: [receipts.paid_by],
    references: [user.id],
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
  paid_by: true,
  created_at: true,
  updated_at: true,
})
