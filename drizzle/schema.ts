import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  /** Stripe customer ID — stored for portal & checkout session creation */
  stripeCustomerId: varchar("stripeCustomerId", { length: 64 }),
  /** Active Stripe subscription ID */
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 64 }),
  /** Subscription plan slug: basic | pro | elite */
  subscriptionPlan: varchar("subscriptionPlan", { length: 32 }),
  /** Subscription status mirrored from Stripe for fast reads */
  subscriptionStatus: varchar("subscriptionStatus", { length: 32 }),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
