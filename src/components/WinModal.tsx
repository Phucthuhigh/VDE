import React from 'react';

interface WinModalProps {
  isOpen: boolean;
  moves: number;
  stars?: number;
  timeFormatted?: string;
  onReset: () => void;
}

export const MinecraftHeart: React.FC<{ isFilled: boolean; className?: string }> = ({ isFilled, className = "w-9 h-9" }) => (
  <svg
    viewBox="0 0 9 9"
    className={`${className} transition-all duration-300 ${
      isFilled 
        ? 'drop-shadow-[0_2px_4px_rgba(225,29,72,0.3)] scale-105' 
        : 'scale-95 opacity-40 grayscale'
    }`}
    style={{ imageRendering: 'pixelated' }}
  >
    {/* Grid: 9x9 Minecraft Heart */}
    {/* Outline (Black / Dark Charcoal) */}
    <rect x="1" y="0" width="2" height="1" fill="#111827" />
    <rect x="6" y="0" width="2" height="1" fill="#111827" />
    <rect x="0" y="1" width="1" height="4" fill="#111827" />
    <rect x="3" y="1" width="1" height="1" fill="#111827" />
    <rect x="5" y="1" width="1" height="1" fill="#111827" />
    <rect x="8" y="1" width="1" height="4" fill="#111827" />
    <rect x="4" y="2" width="1" height="1" fill="#111827" />
    <rect x="1" y="5" width="1" height="1" fill="#111827" />
    <rect x="7" y="5" width="1" height="1" fill="#111827" />
    <rect x="2" y="6" width="1" height="1" fill="#111827" />
    <rect x="6" y="6" width="1" height="1" fill="#111827" />
    <rect x="3" y="7" width="1" height="1" fill="#111827" />
    <rect x="5" y="7" width="1" height="1" fill="#111827" />
    <rect x="4" y="8" width="1" height="1" fill="#111827" />

    {/* Inner Pixel Fill */}
    {isFilled ? (
      <>
        {/* Main Red Fill */}
        <rect x="1" y="1" width="2" height="4" fill="#E11D48" />
        <rect x="6" y="1" width="2" height="4" fill="#E11D48" />
        <rect x="3" y="2" width="1" height="3" fill="#E11D48" />
        <rect x="5" y="2" width="1" height="3" fill="#E11D48" />
        <rect x="4" y="3" width="1" height="2" fill="#E11D48" />
        <rect x="2" y="5" width="5" height="1" fill="#E11D48" />
        <rect x="3" y="6" width="3" height="1" fill="#E11D48" />
        <rect x="4" y="7" width="1" height="1" fill="#E11D48" />

        {/* Dark Red Shadow (Right & Bottom Edges) */}
        <rect x="7" y="2" width="1" height="3" fill="#881337" />
        <rect x="5" y="5" width="2" height="1" fill="#881337" />
        <rect x="4" y="6" width="2" height="1" fill="#881337" />

        {/* Bright Minecraft White/Pink Highlight */}
        <rect x="1" y="1" width="1" height="1" fill="#FFFFFF" />
        <rect x="2" y="1" width="1" height="1" fill="#FFE4E6" />
        <rect x="1" y="2" width="1" height="1" fill="#FFE4E6" />
      </>
    ) : (
      <>
        {/* Empty Heart Gray Fill */}
        <rect x="1" y="1" width="2" height="4" fill="#334155" />
        <rect x="6" y="1" width="2" height="4" fill="#334155" />
        <rect x="3" y="2" width="1" height="3" fill="#334155" />
        <rect x="5" y="2" width="1" height="3" fill="#334155" />
        <rect x="4" y="3" width="1" height="2" fill="#334155" />
        <rect x="2" y="5" width="5" height="1" fill="#334155" />
        <rect x="3" y="6" width="3" height="1" fill="#334155" />
        <rect x="4" y="7" width="1" height="1" fill="#334155" />

        {/* Empty Heart Dark Shadow */}
        <rect x="7" y="2" width="1" height="3" fill="#0F172A" />
        <rect x="5" y="5" width="2" height="1" fill="#0F172A" />
        <rect x="4" y="6" width="2" height="1" fill="#0F172A" />

        {/* Empty Heart Highlight */}
        <rect x="1" y="1" width="1" height="1" fill="#94A3B8" />
      </>
    )}
  </svg>
);

export const WinModal: React.FC<WinModalProps> = ({ 
  isOpen, 
  moves, 
  stars = 5, 
  timeFormatted,
  onReset 
}) => {
  if (!isOpen) return null;

  const starLabels = [
    '',
    'Cố gắng hơn nhé!',
    'Khá tốt!',
    'Tuyệt vời!',
    'Xuất sắc!',
    'Bậc thầy đong nước!'
  ];

  return (
    <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-md flex flex-col items-center justify-center p-6 transition-opacity duration-700">
      <div className="flex flex-col items-center text-center">
        <h1 
          className="text-5xl md:text-[7rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-amber-700 uppercase tracking-widest text-center leading-normal"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            filter: 'drop-shadow(0 0 20px rgba(253, 224, 71, 0.6)) drop-shadow(0 10px 40px rgba(217, 119, 6, 0.8))',
            animation: 'victoryZoom 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
          }}
        >
          VICTORY
        </h1>

        {/* Minecraft Hearts Display */}
        <div 
          className="flex gap-3 my-4 opacity-0"
          style={{ animation: 'victoryFadeUp 1s ease-out 0.5s forwards' }}
        >
          {[1, 2, 3, 4, 5].map((starNum) => (
            <MinecraftHeart key={starNum} isFilled={starNum <= stars} className="w-12 h-12 md:w-16 md:h-16" />
          ))}
        </div>

        <p 
          className="text-xl md:text-2xl text-yellow-300 font-bold mb-2 opacity-0 drop-shadow-md"
          style={{ animation: 'victoryFadeUp 1s ease-out 0.7s forwards' }}
        >
          {starLabels[stars] || `${stars}/5 Mạng`}
        </p>

        <p 
          className="mt-2 text-xl md:text-3xl text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-0"
          style={{ animation: 'victoryFadeUp 1s ease-out 0.9s forwards' }}
        >
          Hoàn thành trong <span className="text-yellow-400 font-extrabold">{moves}</span> bước
          {timeFormatted ? ` (${timeFormatted})` : ''}!
        </p>

        <button 
          className="mt-12 px-12 py-4 bg-transparent border-2 border-yellow-400 text-yellow-400 text-2xl font-bold uppercase tracking-widest rounded-full hover:bg-yellow-400 hover:text-black hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:shadow-[0_0_40px_rgba(250,204,21,0.8)] opacity-0 flex items-center gap-3"
          onClick={onReset}
          style={{ animation: 'victoryFadeUp 1s ease-out 1.2s forwards' }}
        >
          <span className="material-symbols-outlined text-3xl">play_arrow</span>
          CHƠI TIẾP
        </button>
      </div>

      <style>{`
        @keyframes victoryZoom {
          0% { transform: scale(0.3); opacity: 0; filter: blur(10px); }
          50% { opacity: 1; filter: blur(0px); }
          100% { transform: scale(1); opacity: 1; filter: blur(0px); }
        }
        @keyframes victoryFadeUp {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
