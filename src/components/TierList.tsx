'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { TierRow } from './TierRow';
import { VoteModal } from './VoteModal';
import { PatchSelector } from './PatchSelector';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface Character {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  averageTier: string;
  totalVotes: number;
  userVote?: string | null;
  nameImage?: string | null;
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
  const [isMuted, setIsMuted] = useState(false);

  // Generate a session ID if not present
  useEffect(() => {
    if (!localStorage.getItem('deadlock_session')) {
      localStorage.setItem('deadlock_session', Math.random().toString(36).substring(2));
    }
    // Refetch to get user votes since server-side render doesn't have session
    fetchData(meta.currentPatch);
  }, []);

  // Load mute preference
  useEffect(() => {
    const savedMute = localStorage.getItem('deadlock_muted');
    if (savedMute) {
      setIsMuted(savedMute === 'true');
    }
  }, []);

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    localStorage.setItem('deadlock_muted', String(newState));
  };

  const fetchData = async (patch?: string) => {
    setIsLoading(true);
    try {
      const sessionId = localStorage.getItem('deadlock_session');
      const queryParams = new URLSearchParams();
      if (patch) queryParams.set('patch', patch);
      if (sessionId) queryParams.set('sessionId', sessionId);

      const res = await fetch(`/api/tierlist?${queryParams.toString()}`);
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
          <button
            onClick={toggleMute}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-black/40 border border-white/10 hover:bg-white/10 hover:border-gold/50 transition-colors text-gold"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
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

      <motion.div className={`space-y-4 ${isLoading ? 'opacity-50' : ''} transition-opacity duration-300`}>
        {TIERS.map(tier => {
          // Memoize filtering so rows don't re-render on modal open (selectedChar change)
          const tierChars = useMemo(() => characters.filter(c => c.averageTier === tier.name), [characters, tier.name]);

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
          isMuted={isMuted}
          onClose={() => setSelectedChar(null)}
          onVote={handleVote}
        />
      )}
    </div>
  );
}
