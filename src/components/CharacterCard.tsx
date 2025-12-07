import React from 'react';
import Image from 'next/image';

interface Character {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  nameImage?: string | null;
  averageTier: string;
  totalVotes: number;
  userVote?: string | null;
}

interface CharacterCardProps {
  character: Character;
  onClick?: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-card w-24 h-36 flex flex-col items-center justify-start p-2 m-2 rounded-lg border border-white/5 hover:border-gold/50 cursor-pointer shadow-md relative overflow-hidden group transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-1 active:scale-95"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-0" />

      <div className="w-20 h-20 bg-black/50 rounded-md overflow-hidden mb-2 z-10 border border-white/10 group-hover:border-gold/30 transition-colors relative">
        <Image
          src={character.imageUrl}
          alt={character.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      <span className="text-[10px] font-bold text-center uppercase tracking-wider text-gold z-10 truncate w-full font-forevs">
        {character.name}
      </span>

      {character.userVote && (
        <div className="absolute top-1 right-1 w-6 h-6 bg-gold text-black rounded-full flex items-center justify-center text-[10px] font-bold font-forevs z-20 shadow-lg border border-white/20">
          {character.userVote}
        </div>
      )}

      <div className="mt-auto flex items-center justify-center gap-1 z-10">
        <span className={`text-xs font-bold ${getTierColor(character.averageTier)}`}>
          {character.averageTier}
        </span>
        <span className="text-[9px] text-white/30">({character.totalVotes})</span>
      </div>
    </div>
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
