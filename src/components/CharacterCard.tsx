/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { motion } from 'framer-motion';

interface Character {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  averageTier: string;
  totalVotes: number;
}

interface CharacterCardProps {
  character: Character;
  onClick?: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onClick }) => {
  return (
    <motion.div
      layoutId={`char-${character.id}`}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="bg-card w-24 h-36 flex flex-col items-center justify-start p-2 m-2 rounded-lg border border-white/5 hover:border-gold/50 cursor-pointer transition-colors shadow-lg hover:shadow-[0_0_15px_rgba(200,170,110,0.2)] relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-0" />

      <div className="w-20 h-20 bg-black/50 rounded-md overflow-hidden mb-2 z-10 border border-white/10 group-hover:border-gold/30 transition-colors">
        <img src={character.imageUrl} alt={character.name} className="w-full h-full object-cover" />
      </div>

      <span className="text-[10px] font-bold text-center uppercase tracking-wider text-gold z-10 truncate w-full font-cinzel">
        {character.name}
      </span>

      <div className="mt-auto flex items-center justify-center gap-1 z-10">
        <span className={`text-xs font-bold ${getTierColor(character.averageTier)}`}>
          {character.averageTier}
        </span>
        <span className="text-[9px] text-white/30">({character.totalVotes})</span>
      </div>
    </motion.div>
  );
};

function getTierColor(tier: string) {
  switch (tier) {
    case 'S': return 'text-[var(--tier-s)]';
    case 'A': return 'text-[var(--tier-a)]';
    case 'B': return 'text-[var(--tier-b)]';
    case 'C': return 'text-[var(--tier-c)]';
    case 'D': return 'text-[var(--tier-d)]';
    case 'F': return 'text-[var(--tier-f)]';
    default: return 'text-white/50';
  }
}
