import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";


export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    userId: text("user_id").
    notNull(),
});

export const accountsRelation = relations(accounts, ({ many }) => ({
    transactions:many(transactions),
}));



export const insertAccountSchema = createInsertSchema(accounts);
export const categories = pgTable("categories", {
    id: text("id").primaryKey(),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    userId: text("user_id").
    notNull(),
});

export const categoriesRelation = relations(categories, ({ many }) => ({
    transactions:many(transactions),
}));

export const insertCategorySchema = createInsertSchema(accounts);


export const transactions = pgTable("transactions",{
    id:text("id").primaryKey(),
    amount: integer("amount").notNull(),
    payee: text("payee").notNull(),
    notes: text("notes"),
    date: timestamp("date", { mode: "date"}).notNull(),
    accountId: text("account_id").references(() => accounts.id, {
        onDelete: "cascade",
    }).notNull(),
    categoryId: text("category_id").references(() => categories.id, {
        onDelete: "set null",
    }),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
    account: one(accounts, {
        fields: [transactions.accountId],
        references: [accounts.Id]
    }),
    categories: one(categories, {
        fields: [transactions.accountId],
        references: [categories.Id]
    }),
}));

export const insertTransactionSchema = createInsertSchema(transactions, {
    date: z.coerce.date(),
})