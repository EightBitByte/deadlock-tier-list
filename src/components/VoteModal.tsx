import React from 'react';
import { motion } from 'framer-motion';

interface Character {
  id: number;
  name: string;
  imageUrl: string;
}

interface VoteModalProps {
  character: Character;
  onClose: () => void;
  onVote: (tier: string) => void;
}

const TIERS = [
  { name: 'S', color: 'var(--tier-s)' },
  { name: 'A', color: 'var(--tier-a)' },
  { name: 'B', color: 'var(--tier-b)' },
  { name: 'C', color: 'var(--tier-c)' },
  { name: 'D', color: 'var(--tier-d)' },
  { name: 'F', color: 'var(--tier-f)' },
];

export const VoteModal: React.FC<VoteModalProps> = ({ character, onClose, onVote }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-card border border-white/10 p-8 rounded-2xl max-w-sm w-full mx-4 relative shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gold/10 blur-[50px] rounded-full pointer-events-none" />

        <button className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors" onClick={onClose}>✕</button>

        <div className="flex flex-col items-center mb-8 relative z-10">
          <h2 className="text-2xl font-bold mb-4 text-gold font-cinzel">Vote for {character.name}</h2>
          <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-white/20 shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={character.imageUrl} alt={character.name} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 relative z-10">
          {TIERS.map(tier => (
            <motion.button
              key={tier.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onVote(tier.name)}
              className="py-4 font-black text-xl text-black rounded-lg hover:brightness-110 shadow-lg font-cinzel relative overflow-hidden group"
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
