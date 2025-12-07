import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import soundMapRaw from '../lib/sound-map.json';

const soundMap = soundMapRaw as Record<string, { happy: string[], sad: string[] }>;

interface Character {
  id: number;
  name: string;
  imageUrl: string;
  nameImage?: string | null;
  averageTier: string;
  userVote?: string | null;
}

interface VoteModalProps {
  character: Character;
  isMuted?: boolean;
  onClose: () => void;
  onVote: (tier: string) => void;
}

const TIERS = [
  { name: 'S', color: 'var(--tier-s)', value: 6 },
  { name: 'A', color: 'var(--tier-a)', value: 5 },
  { name: 'B', color: 'var(--tier-b)', value: 4 },
  { name: 'C', color: 'var(--tier-c)', value: 3 },
  { name: 'D', color: 'var(--tier-d)', value: 2 },
  { name: 'F', color: 'var(--tier-f)', value: 1 },
];

// Global variable to track currently playing audio across modal instances
let currentAudio: HTMLAudioElement | null = null;

const getTierValue = (tier: string) => {
  const t = TIERS.find(t => t.name === tier);
  return t ? t.value : 0;
};

export const VoteModal: React.FC<VoteModalProps> = ({ character, isMuted = false, onClose, onVote }) => {
  /* 
   * Global `currentAudio` handles cleanup/interruptions across modal re-mounts.
   * No local ref needed for audio tracking.
   */

  const handleVote = (tier: string) => {
    const votedValue = getTierValue(tier);
    const avgValue = getTierValue(character.averageTier);

    // If voting higher or equal to average -> Happy
    // If voting lower -> Sad
    const isHappy = votedValue >= avgValue;
    const type = isHappy ? 'happy' : 'sad';

    const sounds = soundMap[character.name];
    if (!isMuted && sounds && sounds[type] && sounds[type].length > 0) {
      // Stop previous sound (global)
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      const randomSound = sounds[type][Math.floor(Math.random() * sounds[type].length)];
      const audio = new Audio(randomSound);
      audio.volume = 0.4; // Slightly lower volume

      currentAudio = audio;
      audio.play().catch(e => console.error("Audio play failed", e));
    }

    onVote(tier);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-card border border-white/10 p-8 rounded-2xl max-w-sm w-full mx-4 relative shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Optimized: Removed expensive blur glow */}

        <button className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors" onClick={onClose}>✕</button>

        <div className="flex flex-col items-center mb-8 relative z-10 w-full">
          {/* Hero Name Image */}
          <div className="relative h-16 w-full mb-4 flex items-center justify-center">
            {/* Debug: {character.nameImage} */}
            {character.nameImage ? (
              <div className="relative w-48 h-full">
                <Image
                  src={character.nameImage}
                  alt={character.name}
                  fill
                  unoptimized
                  className="object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                />
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-gold font-cinzel">Vote for {character.name}</h2>
            )}
          </div>
          <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-white/20 shadow-2xl relative">
            <Image
              src={character.imageUrl}
              alt={character.name}
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
          <p className="mt-2 text-white/50 text-sm">Current: <span className="text-gold font-bold">{character.averageTier}</span></p>
        </div>

        <div className="grid grid-cols-3 gap-3 relative z-10">
          {TIERS.map(tier => (
            <motion.button
              key={tier.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleVote(tier.name)}
              className={`py-4 font-black text-xl text-black rounded-lg hover:brightness-110 shadow-lg font-cinzel relative overflow-hidden group ${character.userVote === tier.name ? 'ring-4 ring-white ring-offset-2 ring-offset-black' : ''}`}
              style={{ backgroundColor: tier.color }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10">{tier.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
