import * as dotenv from "dotenv";
import { exit } from 'process';

dotenv.config({ path: ".env.local" });

// Fetched dynamically
const characterData: any[] = [];

async function seed() {
  const { db } = await import('./index');
  const { characters } = await import('./schema');

  console.log('Fetching characters from API...');
  try {
    const response = await fetch('https://assets.deadlock-api.com/v2/heroes');
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const heroes = await response.json();

    const validHeroes = heroes.filter((h: any) => h.player_selectable === true && h.disabled !== true);

    const mappedCharacters = validHeroes.map((h: any) => ({
      name: h.name,
      slug: h.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
      imageUrl: h.images.icon_hero_card_webp || h.images.icon_hero_card || '',
    }));

    console.log(`Seeding ${mappedCharacters.length} characters...`);

    // We want to update existing characters if they exist to get the new images, 
    // or insert new ones. onConflictDoUpdate would be better than DoNothing.
    // Drizzle support for onConflictDoUpdate:
    // .onConflictDoUpdate({ target: characters.name, set: { imageUrl: sql`excluded.image_url` } })

    // Since we defined `name` as unique in schema, we can use that.

    // Insert or Update valid characters
    for (const char of mappedCharacters) {
      await db.insert(characters)
        .values(char)
        .onConflictDoUpdate({
          target: characters.name,
          set: { imageUrl: char.imageUrl, slug: char.slug }
        });
    }

    // Remove characters that are no longer in the valid list (e.g. they were disabled)
    // We need 'inArray' and 'notInArray' from drizzle-orm
    const { inArray, notInArray } = await import('drizzle-orm');
    const validNames = mappedCharacters.map((c: any) => c.name);

    if (validNames.length > 0) {
      await db.delete(characters)
        .where(notInArray(characters.name, validNames));
    }

  } catch (e) {
    console.error("Error fetching/seeding:", e);
    exit(1);
  }

  console.log('Seeding complete!');
  exit(0);
}

seed();
