'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PatchSelectorProps {
  currentPatch: string;
  latestPatch: string;
  patches: number[];
  onSelect: (patch: string) => void;
}

export const PatchSelector: React.FC<PatchSelectorProps> = ({ currentPatch, latestPatch, patches, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (patch: string) => {
    onSelect(patch);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-black/60 border border-white/20 text-gold px-4 py-2 rounded-lg hover:border-gold hover:bg-black/80 transition-all font-forevs text-sm tracking-wide min-w-[140px] justify-between z-20 relative"
      >
        <span>Patch {currentPatch}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-xs opacity-70"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute top-full mt-2 right-0 w-48 max-h-60 overflow-y-auto bg-[#141412] border border-gold/30 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.8)] z-50 scrollbar-thin scrollbar-thumb-gold/50 scrollbar-track-transparent"
          >
            {patches.map((p) => {
              const pStr = p.toString();
              const isLatest = pStr === latestPatch;
              const isSelected = pStr === currentPatch;

              return (
                <button
                  key={p}
                  onClick={() => handleSelect(pStr)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors text-sm ${isSelected ? 'text-gold bg-white/5' : 'text-white/70'}`}
                >
                  <span className="font-mono">{p}</span>
                  {isLatest && <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded border border-gold/30">LATEST</span>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
