import { NextResponse } from 'next/server';
import { getTierListData } from '../../../lib/tierlist-data';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedPatch = searchParams.get('patch');
    const sessionId = searchParams.get('sessionId');

    const data = await getTierListData(requestedPatch, sessionId);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching tierlist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
