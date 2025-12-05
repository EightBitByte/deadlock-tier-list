/* eslint-disable @next/next/no-img-element */
import React from 'react';

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
    <div
      onClick={onClick}
      className="bg-card w-24 h-32 flex flex-col items-center justify-center m-2 rounded border border-white/10 hover:border-gold cursor-pointer transition-all hover:scale-105"
    >
      <div className="w-16 h-16 bg-black/50 rounded-full overflow-hidden mb-2">
        {/* Placeholder or actual image */}
        <img src={character.imageUrl} alt={character.name} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-bold text-center px-1 truncate w-full">{character.name}</span>
      <span className="text-[10px] text-white/50">{character.averageTier} ({character.totalVotes})</span>
    </div>
  );
};
