import React from 'react';

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
  { name: 'S', color: '#ff7f7f' },
  { name: 'A', color: '#ffbf7f' },
  { name: 'B', color: '#ffff7f' },
  { name: 'C', color: '#7fff7f' },
  { name: 'D', color: '#7fbfff' },
  { name: 'F', color: '#bf7fff' },
];

export const VoteModal: React.FC<VoteModalProps> = ({ character, onClose, onVote }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-card border border-white/10 p-6 rounded-lg max-w-sm w-full mx-4 relative shadow-[0_0_30px_rgba(200,170,110,0.1)]"
        onClick={e => e.stopPropagation()}
      >
        <button className="absolute top-2 right-4 text-white/50 hover:text-white" onClick={onClose}>✕</button>

        <div className="flex flex-col items-center mb-6">
          <h2 className="text-xl font-bold mb-1 text-gold">Vote for {character.name}</h2>
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 mt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={character.imageUrl} alt={character.name} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {TIERS.map(tier => (
            <button
              key={tier.name}
              onClick={() => onVote(tier.name)}
              className="py-3 font-black text-lg text-black rounded hover:brightness-110 active:scale-95 transition-transform"
              style={{ backgroundColor: tier.color }}
            >
              {tier.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
