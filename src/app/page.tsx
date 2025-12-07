import React from 'react';
import TierList from '@/components/TierList';
import { getTierListData } from '@/lib/tierlist-data';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // On server side, we don't have session ID yet, so initial load won't show user votes
  // The client-side useEffect in TierList will fetch with session ID if needed.
  // Direct DB call to avoid "fetch failed" with ECONNREFUSED in Docker
  const { tierList, metadata } = await getTierListData();

  return (
    <main className="min-h-screen py-12">
      <TierList initialData={tierList} initialMeta={metadata} />
    </main>
  );
}
