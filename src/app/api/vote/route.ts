import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { votes } from '../../../db/schema';
import { getLatestPatch } from '../../../lib/patches';

import { createHash } from 'crypto';

export async function POST(request: Request) {
  try {
    const { characterId, tier, sessionId } = await request.json();

    if (!characterId || !tier) {
      return NextResponse.json({ error: 'Missing Required Fields' }, { status: 400 });
    }

    const latestPatch = await getLatestPatch();

    // Extract IP address from headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';

    // Hash the IP to protect user privacy
    const ipHash = createHash('sha256').update(ip + 'SALT_V1').digest('hex');

    // Upsert vote for this IP Hash + character + patch
    await db.insert(votes)
      .values({
        characterId,
        tier,
        sessionId: sessionId || 'anonymous', // Keep session ID for frontend reference if needed, but not for uniqueness
        ipHash,
        patch: latestPatch,
      })
      .onConflictDoUpdate({
        target: [votes.characterId, votes.ipHash, votes.patch],
        set: { tier, createdAt: new Date() },
      });

    return NextResponse.json({ success: true, patch: latestPatch });
  } catch (error) {
    console.error('Error submitting vote:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
