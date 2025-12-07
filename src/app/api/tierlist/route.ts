import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { characters, votes } from '../../../db/schema';
import { sql } from 'drizzle-orm';
import { getPatches } from '../../../lib/patches';

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedPatch = searchParams.get('patch');

    // Fetch all patches from upstream
    const allPatches = await getPatches();
    const latestPatch = allPatches.length > 0 ? allPatches[0].toString() : 'unknown';

    // Determine which patch to view: requested -> latest -> 'unknown'
    const targetPatch = requestedPatch || latestPatch;

    const allCharacters = await db.select().from(characters);

    // Filter votes by the target patch
    const voteCounts = await db.execute(sql`
      SELECT ${votes.characterId} as character_id, ${votes.tier} as tier, count(*) as count
      FROM ${votes}
      WHERE ${votes.patch} = ${targetPatch}
      GROUP BY ${votes.characterId}, ${votes.tier}
    `);

    const charStats: Record<number, { totalScore: number; totalVotes: number }> = {};

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

    // Fetch user's votes if sessionId is provided
    const sessionId = searchParams.get('sessionId');
    const userVotesMap: Record<number, string> = {};

    if (sessionId) {
      const userVotes = await db.execute(sql`
        SELECT ${votes.characterId} as character_id, ${votes.tier} as tier
        FROM ${votes}
        WHERE ${votes.sessionId} = ${sessionId} AND ${votes.patch} = ${targetPatch}
      `);

      for (const row of userVotes) {
        userVotesMap[row.character_id as number] = row.tier as string;
      }
    }

    const tierList = allCharacters.map(char => {
      const stats = charStats[char.id];
      let averageTier = 'N/A';

      if (stats.totalVotes > 0) {
        const avgScore = Math.round(stats.totalScore / stats.totalVotes);
        averageTier = VALUE_TO_TIER[avgScore] || 'C';
      }

      return {
        ...char,
        averageTier,
        totalVotes: stats.totalVotes,
        userVote: userVotesMap[char.id] || null
      };
    });

    return NextResponse.json({
      tierList,
      metadata: {
        currentPatch: targetPatch,
        latestPatch,
        allPatches,
        isLatest: targetPatch === latestPatch
      }
    });

  } catch (error) {
    console.error('Error fetching tierlist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
