import { NextResponse } from 'next/server';
import { db } from '@/db';
import { votes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { characterId, tier, sessionId } = body;

    if (!characterId || !tier || !sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate tier
    const validTiers = ['S', 'A', 'B', 'C', 'D', 'F'];
    if (!validTiers.includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    // Check if user already voted for this character
    // We update the existing vote if they voted again
    // Ideally we might keep history, but for a tierlist "snapshot" behavior is better.

    // Upsert logic:
    // Check exist
    const existingVote = await db.select()
      .from(votes)
      .where(and(
        eq(votes.characterId, characterId),
        eq(votes.sessionId, sessionId)
      ))
      .limit(1);

    if (existingVote.length > 0) {
      // Update
      await db.update(votes)
        .set({ tier, createdAt: new Date() })
        .where(eq(votes.id, existingVote[0].id));
    } else {
      // Insert
      await db.insert(votes).values({
        characterId,
        tier,
        sessionId,
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error submitting vote:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
