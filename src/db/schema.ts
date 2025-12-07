import { pgTable, serial, text, integer, timestamp, unique } from 'drizzle-orm/pg-core';

export const characters = pgTable('characters', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull(),
  imageUrl: text('image_url').notNull(),
  nameImage: text('name_image'),
});

export const votes = pgTable('votes', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id).notNull(),
  tier: text('tier').notNull(), // 'S', 'A', 'B', 'C', 'D', 'F'
  patch: text('patch').notNull().default('unknown'),
  sessionId: text('session_id').notNull(),
  ipHash: text('ip_hash').notNull().default('legacy'), // Default for existing rows
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  // We switch uniqueness to rely on IP hash instead of session ID for stricter limits
  unq: unique().on(t.characterId, t.ipHash, t.patch),
}));
