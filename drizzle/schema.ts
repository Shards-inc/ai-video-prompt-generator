import { mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Video prompt templates
export const promptTemplates = mysqlTable("promptTemplates", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description"),
  youtubePrompt: text("youtubePrompt").notNull(),
  tiktokPrompt: text("tiktokPrompt").notNull(),
  isPublic: mysqlEnum("isPublic", ["true", "false"]).default("true").notNull(),
  createdBy: varchar("createdBy", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type PromptTemplate = typeof promptTemplates.$inferSelect;
export type InsertPromptTemplate = typeof promptTemplates.$inferInsert;

// User generated prompts
export const generatedPrompts = mysqlTable("generatedPrompts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("userId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  topic: text("topic").notNull(),
  category: varchar("category", { length: 100 }),
  youtubePrompt: text("youtubePrompt").notNull(),
  tiktokPrompt: text("tiktokPrompt").notNull(),
  templateId: varchar("templateId", { length: 64 }),
  customizations: text("customizations"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type GeneratedPrompt = typeof generatedPrompts.$inferSelect;
export type InsertGeneratedPrompt = typeof generatedPrompts.$inferInsert;
