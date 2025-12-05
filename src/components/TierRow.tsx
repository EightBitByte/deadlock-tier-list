import React from 'react';
import { CharacterCard } from './CharacterCard';

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
    <div className="flex w-full mb-4 bg-white/5 rounded-lg overflow-hidden min-h-[100px]">
      <div
        className="w-24 flex items-center justify-center text-4xl font-black text-black shrink-0"
        style={{ backgroundColor: color }}
      >
        {tier}
      </div>
      <div className="flex flex-wrap p-2 w-full bg-black/20">
        {characters.map(char => (
          <CharacterCard key={char.id} character={char} onClick={() => onCharacterClick(char)} />
        ))}
      </div>
    </div>
  );
};
