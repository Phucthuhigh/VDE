import React from 'react';

interface GameOverModalProps {
  isOpen: boolean;
  onReset: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, onReset }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-md flex flex-col items-center justify-center p-6 transition-opacity duration-700">
      <div className="flex flex-col items-center">
        <h1
          className="flex flex-wrap justify-center gap-x-4 md:gap-x-6 text-5xl md:text-[6.5rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-red-300 via-rose-500 to-red-800 uppercase tracking-widest text-center leading-normal"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            filter: 'drop-shadow(0 0 20px rgba(244, 63, 94, 0.6)) drop-shadow(0 10px 40px rgba(159, 18, 57, 0.8))',
            animation: 'gameOverZoom 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
          }}
        >
          <span>GAME</span>
          <span>OVER</span>
        </h1>

        <div className="flex items-center gap-2 mt-4 text-rose-400 animate-alarm-ring">
          <span className="material-symbols-outlined text-5xl drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]">timer_off</span>
        </div>

        <p 
          className="mt-4 text-xl md:text-3xl text-red-100 font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-0 text-center"
          style={{ animation: 'gameOverFadeUp 1s ease-out 0.6s forwards' }}
        >
          Đã hết thời gian đong nước!
        </p>

        <button 
          className="mt-12 px-12 py-4 bg-transparent border-2 border-rose-500 text-rose-300 text-2xl font-bold uppercase tracking-widest rounded-full hover:bg-rose-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:shadow-[0_0_40px_rgba(244,63,94,0.8)] opacity-0 flex items-center gap-3"
          onClick={onReset}
          style={{ animation: 'gameOverFadeUp 1s ease-out 1s forwards' }}
        >
          <span className="material-symbols-outlined text-3xl">restart_alt</span>
          THỬ LẠI
        </button>
      </div>

      <style>{`
        @keyframes gameOverZoom {
          0% { transform: scale(0.3); opacity: 0; filter: blur(10px); }
          50% { opacity: 1; filter: blur(0px); }
          100% { transform: scale(1); opacity: 1; filter: blur(0px); }
        }
        @keyframes gameOverFadeUp {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
