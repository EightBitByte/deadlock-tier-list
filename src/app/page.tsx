import React from 'react';
import TierList from '@/components/TierList';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let initialData = [];
  try {
    const res = await fetch('http://localhost:3000/api/tierlist', { cache: 'no-store' });
    if (res.ok) {
      initialData = await res.json();
    }
  } catch (e) {
    console.error("Failed to fetch initial data", e);
  }

  return (
    <main className="min-h-screen bg-background text-foreground py-8">
      <TierList initialData={initialData} />
    </main>
  );
}
