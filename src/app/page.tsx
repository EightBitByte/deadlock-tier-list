import React from 'react';
import TierList from '@/components/TierList';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // On server side, we don't have session ID yet, so initial load won't show user votes
  // The client-side useEffect in TierList will fetch with session ID if needed.
  const res = await fetch('http://localhost:3000/api/tierlist', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const { tierList, metadata } = await res.json();

  return (
    <main className="min-h-screen py-12">
      <TierList initialData={tierList} initialMeta={metadata} />
    </main>
  );
}
