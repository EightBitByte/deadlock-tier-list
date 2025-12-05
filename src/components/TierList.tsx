'use client';
import React, { useState, useEffect } from 'react';
import { TierRow } from './TierRow';
import { VoteModal } from './VoteModal';

interface Character {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  averageTier: string;
  totalVotes: number;
}

const TIERS = [
  { name: 'S', color: '#ff7f7f' },
  { name: 'A', color: '#ffbf7f' },
  { name: 'B', color: '#ffff7f' },
  { name: 'C', color: '#7fff7f' },
  { name: 'D', color: '#7fbfff' },
  { name: 'F', color: '#bf7fff' },
];

export default function TierList({ initialData }: { initialData: Character[] }) {
  const [characters, setCharacters] = useState<Character[]>(initialData);
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);

  const refreshData = async () => {
    const res = await fetch('/api/tierlist');
    if (res.ok) {
      const data = await res.json();
      setCharacters(data);
    }
  };

  const handleVote = async (tier: string) => {
    if (!selectedChar) return;

    // Generate or retrieve session ID
    let sessionId = sessionStorage.getItem('deadlock_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(7);
      sessionStorage.setItem('deadlock_session_id', sessionId);
    }

    try {
      await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId: selectedChar.id,
          tier,
          sessionId
        })
      });
      await refreshData();
      setSelectedChar(null);
    } catch (e) {
      console.error("Vote failed", e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-gold uppercase tracking-widest">Deadlock Tier List</h1>

      {TIERS.map(tier => (
        <TierRow
          key={tier.name}
          tier={tier.name}
          color={tier.color}
          characters={characters.filter(c => c.averageTier === tier.name)}
          onCharacterClick={setSelectedChar}
        />
      ))}

      {/* Unranked / New characters */}
      {characters.filter(c => c.averageTier === 'N/A').length > 0 && (
        <TierRow
          tier="?"
          color="#ccc"
          characters={characters.filter(c => c.averageTier === 'N/A')}
          onCharacterClick={setSelectedChar}
        />
      )}

      {selectedChar && (
        <VoteModal
          character={selectedChar}
          onClose={() => setSelectedChar(null)}
          onVote={handleVote}
        />
      )}
    </div>
  );
}
