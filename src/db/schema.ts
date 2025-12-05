import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const characters = pgTable('characters', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull(),
  imageUrl: text('image_url').notNull(),
});

export const votes = pgTable('votes', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id).notNull(),
  tier: text('tier').notNull(), // 'S', 'A', 'B', 'C', 'D', 'F'
  sessionId: text('session_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
