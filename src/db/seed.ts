import * as dotenv from "dotenv";
import { exit } from 'process';
import * as fs from 'fs';

dotenv.config({ path: ".env.local" });

async function seed() {
  console.log('Fetching characters from API...');
  try {
    const response = await fetch('https://assets.deadlock-api.com/v2/heroes');
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const heroes = await response.json();

    const validHeroes = heroes.filter((h: any) => h.player_selectable === true && h.disabled !== true);

    const mappedCharacters = validHeroes.map((h: any) => ({
      name: h.name.replace(/'/g, "''"), // Escape single quotes for SQL
      slug: h.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
      imageUrl: h.images.icon_hero_card_webp || h.images.icon_hero_card || '',
      nameImage: h.images.name_image || '',
    }));

    console.log(`Generating SQL for ${mappedCharacters.length} characters...`);

    let sql = '';

    for (const char of mappedCharacters) {
      // D1/SQLite upsert syntax
      sql += `INSERT INTO characters (name, slug, image_url, name_image) VALUES ('${char.name}', '${char.slug}', '${char.imageUrl}', '${char.nameImage}') ON CONFLICT(name) DO UPDATE SET slug=excluded.slug, image_url=excluded.image_url, name_image=excluded.name_image;\n`;
    }

    // Clean up invalid characters
    const validNames = mappedCharacters.map((c: any) => `'${c.name}'`).join(', ');
    if (validNames.length > 0) {
      sql += `DELETE FROM characters WHERE name NOT IN (${validNames});\n`;
    }

    fs.writeFileSync('seed.sql', sql);
    console.log('Generated seed.sql');

  } catch (e) {
    console.error("Error fetching/seeding:", e);
    exit(1);
  }

  exit(0);
}

seed();
