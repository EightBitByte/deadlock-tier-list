import { NextResponse } from 'next/server';
import { db } from '@/db';
import { characters, votes } from '@/db/schema';
import { sql, eq } from 'drizzle-orm';

const TIER_VALUES: Record<string, number> = {
  S: 6,
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  F: 1,
};

const VALUE_TO_TIER: Record<number, string> = {
  6: 'S',
  5: 'A',
  4: 'B',
  3: 'C',
  2: 'D',
  1: 'F',
};

export async function GET() {
  try {
    // We want all characters, and their average tier score.
    // Since 'tier' is text in DB, we handle conversion carefully or just fetch raw counts.
    // For MVP/simplicity with Drizzle (and avoiding complex SQL CASE maps right now), 
    // let's fetch characters and aggregated vote counts, then compute average in JS.
    // This is performant enough for < 100 characters.

    const allCharacters = await db.select().from(characters);

    // Fetch all votes. For a large app, we'd aggregate in SQL.
    // For now, let's try to aggregate in SQL using raw SQL if possible, or just fetch all.
    // Let's fetch all votes for now? No, that scales poorly.
    // Let's use sql template for aggregation.

    /*
      SELECT character_id, tier, count(*) 
      FROM votes 
      GROUP BY character_id, tier
    */

    const voteCounts = await db.execute(sql`
      SELECT ${votes.characterId} as character_id, ${votes.tier} as tier, count(*) as count
      FROM ${votes}
      GROUP BY ${votes.characterId}, ${votes.tier}
    `);

    // Process in memory
    const charStats: Record<number, { totalScore: number; totalVotes: number }> = {};

    // Initialize
    for (const char of allCharacters) {
      charStats[char.id] = { totalScore: 0, totalVotes: 0 };
    }

    for (const row of voteCounts) {
      const charId = row.character_id as number;
      const tier = row.tier as string;
      const count = Number(row.count);

      if (charStats[charId] && TIER_VALUES[tier]) {
        charStats[charId].totalScore += TIER_VALUES[tier] * count;
        charStats[charId].totalVotes += count;
      }
    }

    const result = allCharacters.map(char => {
      const stats = charStats[char.id];
      let averageTier = 'C'; // Default to middle if no votes? Or separate "Unranked"?

      if (stats.totalVotes > 0) {
        const avgScore = Math.round(stats.totalScore / stats.totalVotes);
        averageTier = VALUE_TO_TIER[avgScore] || 'C';
      } else {
        averageTier = 'N/A';
      }

      return {
        ...char,
        averageTier,
        totalVotes: stats.totalVotes
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching tierlist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
