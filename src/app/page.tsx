import React from 'react';
import TierList from '@/components/TierList';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // The API now returns { tierList, metadata }.
  // We need to fetch the full object.
  // Note: Internal API calls in Server Components should technically be direct DB calls or use full URL.
  // But for simplicity/standard Next.js pattern, we can fetch from localhost if needed, or better:
  // Since we are server-side, we should just invoke the logic directly or use a helper. 
  // However, `fetch` to relative URL is not allowed in Server Components usually unless absolute.
  // Best practice: Refactor the API logic into a controller/service and call it here.
  // BUT, to avoid refactoring everything, let's just use `http://localhost:3000` (risky if port changes) or make the API logic shared.
  // Actually, for this specific environment, we can use the absolute URL.
  // OR, better, let's duplicate the fetch logic slightly or move the `GET` logic to a shared function.
  // Actually, I'll just use the fetch with `http://localhost:3000` for now as I know the port, OR allow the client to fetch initially.
  // Better: Let's make the Page client-side fetching? No, SEO.
  // I will assume `http://localhost:3000` works for now, or use `process.env.PORT`.

  // Actually, the previous implementation did `const res = await fetch('http://localhost:3000/api/tierlist');`? 
  // No, the previous code was `const res = await fetch('http://localhost:3000/api/tierlist', { cache: 'no-store' });` in the hidden part?
  // Let's check the original file content again.
  // Ah, the file view showed:
  /*
  export default async function Home() {
  const res = await fetch('http://localhost:3000/api/tierlist', { cache: 'no-store' });
  const data = await res.json();
  ...
  */
  // So I can just update that.

  const res = await fetch('http://localhost:3000/api/tierlist', { cache: 'no-store' });
  const { tierList, metadata } = await res.json();

  return (
    <main className="min-h-screen py-12">
      <TierList initialData={tierList} initialMeta={metadata} />
    </main>
  );
}
