'use client';
import React, { useEffect, useState } from 'react';
import { TierRow } from './TierRow';
import { VoteModal } from './VoteModal';
import { PatchSelector } from './PatchSelector';
import { motion } from 'framer-motion';

interface Character {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  averageTier: string;
  totalVotes: number;
}

interface MetaData {
  currentPatch: string;
  latestPatch: string;
  allPatches: number[];
  isLatest: boolean;
}

const TIERS = [
  { name: 'S', color: '#ff6b6b' },
  { name: 'A', color: '#ffaa5f' },
  { name: 'B', color: '#ffe66d' },
  { name: 'C', color: '#6dff86' },
  { name: 'D', color: '#6dcbff' },
  { name: 'F', color: '#b66dff' },
];

export default function TierList({ initialData, initialMeta }: { initialData: Character[], initialMeta: MetaData }) {
  const [characters, setCharacters] = useState<Character[]>(initialData);
  const [meta, setMeta] = useState<MetaData>(initialMeta);
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generate a session ID if not present
  useEffect(() => {
    if (!localStorage.getItem('deadlock_session')) {
      localStorage.setItem('deadlock_session', Math.random().toString(36).substring(2));
    }
  }, []);

  const fetchData = async (patch?: string) => {
    setIsLoading(true);
    try {
      const query = patch ? `?patch=${patch}` : '';
      const res = await fetch(`/api/tierlist${query}`);
      const data = await res.json();
      setCharacters(data.tierList);
      setMeta(data.metadata);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (tier: string) => {
    if (!selectedChar) return;

    const sessionId = localStorage.getItem('deadlock_session');

    await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        characterId: selectedChar.id,
        tier,
        sessionId
      }),
    });

    setSelectedChar(null);
    fetchData(meta.currentPatch);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold to-white drop-shadow-sm font-forevs tracking-wider">
          Community Tier List
        </h1>

        <div className="flex items-center gap-4">
          <PatchSelector
            currentPatch={meta.currentPatch}
            latestPatch={meta.latestPatch}
            patches={meta.allPatches}
            onSelect={fetchData}
          />
        </div>
      </div>

      {!meta.isLatest && (
        <div className="bg-blue-500/10 border border-blue-500/30 text-blue-200 px-4 py-3 rounded mb-6 flex items-center gap-2">
          <span className="text-xl">ℹ</span>
          <span>You are viewing an archived patch ({meta.currentPatch}). Voting is disabled. Switch to the <strong>Latest</strong> patch to vote.</span>
        </div>
      )}

      <motion.div layout className={`space-y-4 ${isLoading ? 'opacity-50' : ''} transition-opacity duration-300`}>
        {TIERS.map(tier => {
          const tierChars = characters.filter(c => c.averageTier === tier.name);
          return (
            <TierRow
              key={tier.name}
              tier={tier.name}
              characters={tierChars}
              color={tier.color}
              onCharacterClick={meta.isLatest ? setSelectedChar : () => { }}
            />
          );
        })}

        {/* Unranked / N/A */}
        <TierRow
          tier="N/A"
          characters={characters.filter(c => c.averageTier === 'N/A')}
          color="#555"
          onCharacterClick={meta.isLatest ? setSelectedChar : () => { }}
        />
      </motion.div>

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
