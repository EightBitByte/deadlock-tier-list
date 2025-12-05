import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { votes } from '../../../db/schema';
import { getLatestPatch } from '../../../lib/patches';

export async function POST(request: Request) {
  try {
    const { characterId, tier, sessionId } = await request.json();

    if (!characterId || !tier || !sessionId) {
      return NextResponse.json({ error: 'Missing Required Fields' }, { status: 400 });
    }

    const latestPatch = await getLatestPatch();

    // Upsert vote for this session + character + patch
    // We assume the schema has a unique constraint on (characterId, sessionId, patch)
    await db.insert(votes)
      .values({
        characterId,
        tier,
        sessionId,
        patch: latestPatch,
      })
      .onConflictDoUpdate({
        target: [votes.characterId, votes.sessionId, votes.patch],
        set: { tier, createdAt: new Date() },
      });

    return NextResponse.json({ success: true, patch: latestPatch });
  } catch (error) {
    console.error('Error submitting vote:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
