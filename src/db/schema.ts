import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core';

export const characters = sqliteTable('characters', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull(),
  imageUrl: text('image_url').notNull(),
  nameImage: text('name_image'),
});

export const votes = sqliteTable('votes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  characterId: integer('character_id').references(() => characters.id).notNull(),
  tier: text('tier').notNull(), // 'S', 'A', 'B', 'C', 'D', 'F'
  patch: text('patch').notNull().default('unknown'),
  sessionId: text('session_id').notNull(),
  ipHash: text('ip_hash').notNull().default('legacy'), // Default for existing rows
  createdAt: integer('created_at', { mode: 'timestamp' }).default(new Date()), // SQLite stores dates as numbers or text
}, (t) => ({
  // We switch uniqueness to rely on IP hash instead of session ID for stricter limits
  unq: unique().on(t.characterId, t.ipHash, t.patch),
}));
