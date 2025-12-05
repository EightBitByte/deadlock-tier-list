import React from 'react';
import { CharacterCard } from './CharacterCard';
import { motion, AnimatePresence } from 'framer-motion';

interface Character {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  averageTier: string;
  totalVotes: number;
}

interface TierRowProps {
  tier: string;
  characters: Character[];
  color: string;
  onCharacterClick: (char: Character) => void;
}

export const TierRow: React.FC<TierRowProps> = ({ tier, characters, color, onCharacterClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex w-full mb-6 bg-black/40 backdrop-blur-sm rounded-r-xl overflow-hidden border-l-4 min-h-[140px] shadow-lg relative"
      style={{ borderColor: color }}
    >
      {/* Tier Label */}
      <div
        className="w-24 group flex items-center justify-center relative shrink-0 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20" style={{ backgroundColor: color }} />
        <span className="text-5xl font-black font-cinzel text-white drop-shadow-md z-10" style={{ textShadow: `0 0 20px ${color}` }}>
          {tier}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-wrap p-2 w-full items-center content-start">
        <AnimatePresence>
          {characters.map(char => (
            <CharacterCard key={char.id} character={char} onClick={() => onCharacterClick(char)} />
          ))}
        </AnimatePresence>

        {characters.length === 0 && (
          <div className="w-full h-full flex items-center justify-center opacity-10 text-sm italic font-cinzel">
            No Heroes
          </div>
        )}
      </div>
    </motion.div>
  );
};
