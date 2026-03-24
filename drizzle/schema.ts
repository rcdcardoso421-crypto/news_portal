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
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de categorias de notícias
 */
export const newsCategories = mysqlTable("news_categories", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NewsCategory = typeof newsCategories.$inferSelect;
export type InsertNewsCategory = typeof newsCategories.$inferInsert;

/**
 * Tabela de notícias
 */
export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  externalId: varchar("externalId", { length: 255 }).notNull().unique(),
  categoryId: int("categoryId").notNull(),
  title: text("title").notNull(),
  originalTitle: text("originalTitle").notNull(),
  description: text("description"),
  content: text("content"),
  originalContent: text("originalContent"),
  author: varchar("author", { length: 255 }),
  imageUrl: text("imageUrl"),
  sourceUrl: text("sourceUrl").notNull(),
  sourceName: varchar("sourceName", { length: 255 }),
  publishedAt: timestamp("publishedAt"),
  isRewritten: int("isRewritten").default(0).notNull(),
  views: int("views").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

/**
 * Tabela de histórico de leitura de usuários
 */
export const readingHistory = mysqlTable("reading_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  articleId: int("articleId").notNull(),
  readAt: timestamp("readAt").defaultNow().notNull(),
  timeSpent: int("timeSpent").default(0), // em segundos
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReadingHistory = typeof readingHistory.$inferSelect;
export type InsertReadingHistory = typeof readingHistory.$inferInsert;

/**
 * Tabela de preferências de categorias por usuário
 */
export const userCategoryPreferences = mysqlTable("user_category_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  categoryId: int("categoryId").notNull(),
  interestScore: int("interestScore").default(1).notNull(), // 1-10
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserCategoryPreference = typeof userCategoryPreferences.$inferSelect;
export type InsertUserCategoryPreference = typeof userCategoryPreferences.$inferInsert;