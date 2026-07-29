import React from 'react';

interface WinModalProps {
  isOpen: boolean;
  moves: number;
  onReset: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({ isOpen, moves, onReset }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-on-background/80 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-white p-12 rounded-3xl text-center max-w-md w-full border-4 border-tertiary shadow-2xl">
        <span className="material-symbols-outlined text-tertiary text-9xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
          emoji_events
        </span>
        <h2 className="text-on-surface font-headline-h1 text-headline-h1 mb-2">XUẤT SẮC!</h2>
        <p className="text-on-surface-variant mb-8">
          Hoan hô, bạn đã giải được câu đố chỉ với <span className="font-bold text-tertiary">{moves}</span> bước!
        </p>
        <button 
          className="w-full bg-tertiary text-on-tertiary py-4 rounded-xl font-bold text-xl hover:scale-105 transition-transform shadow-lg" 
          onClick={onReset}
        >
          CHƠI LẠI
        </button>
      </div>
    </div>
  );
};
