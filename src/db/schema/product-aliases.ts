import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { user } from './users'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export const productAliases = pgTable('product_aliases', {
  id: serial('id').primaryKey(),
  user_id: text('user_id')
    .references(() => user.id)
    .notNull(),
  original_name: varchar('original_name', { length: 255 }).notNull(), // nazwa z paragonu
  friendly_name: varchar('friendly_name', { length: 255 }).notNull(), // przyjazna nazwa ustawiona przez użytkownika
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

// Relations
export const productAliasesRelations = relations(productAliases, ({ one }) => ({
  user: one(user, {
    fields: [productAliases.user_id],
    references: [user.id],
  }),
}))

// Types
export type ProductAlias = InferSelectModel<typeof productAliases>
export type NewProductAlias = InferInsertModel<typeof productAliases>
