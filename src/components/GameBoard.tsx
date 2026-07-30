import type { CSSProperties } from 'react';
import { JUGS_CAPACITIES } from '../config/gameConfig';
import type { PourAnimationState } from '../hooks/useWaterJugGame';
import { Jug } from './Jug';

interface GameBoardProps {
  currentVolumes: number[];
  selectedIdx: number | null;
  pourAnimation: PourAnimationState | null;
  pourStyle: CSSProperties;
  isBusy: boolean;
  setJugRef: (idx: number) => (el: HTMLDivElement | null) => void;
  onJugSelect: (idx: number) => void;
  onFill: () => void;
  onEmpty: () => void;
  onOpenTutorial: () => void;
}

function getStatusMessage(selectedIdx: number | null, currentVolumes: number[]): string {
  if (selectedIdx === null) return 'Chọn một bình để thao tác';
  const selectedCap = JUGS_CAPACITIES[selectedIdx];
  if (currentVolumes[selectedIdx] === 0) {
    return `Đang chọn bình ${selectedCap}L. Bình rỗng, hãy bấm Bơm đầy nhé!`;
  }
  return `Đang chọn bình ${selectedCap}L. Hãy chọn bình khác để rót sang, hoặc đổ đi nhé!`;
}

export function GameBoard({
  currentVolumes,
  selectedIdx,
  pourAnimation,
  pourStyle,
  isBusy,
  setJugRef,
  onJugSelect,
  onFill,
  onEmpty,
  onOpenTutorial,
}: GameBoardProps) {
  const statusMessage = getStatusMessage(selectedIdx, currentVolumes);

  return (
    <section className="flex-1 flex flex-col items-center justify-center gap-12 order-1 lg:order-2 relative rounded-3xl p-8 min-h-[600px] z-10">
      <button
        type="button"
        onClick={onOpenTutorial}
        className="absolute top-6 right-6 bg-white/80 hover:bg-white text-blue-600 px-4 py-2 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
      >
        <span className="material-symbols-outlined">help</span>
        <span className="hidden sm:inline">Hướng dẫn chi tiết</span>
      </button>

      {/* Status Message */}
      <div className="min-h-[4rem] mt-2 -mb-4 flex items-center justify-center z-20">
        <div className={`px-10 py-4 rounded-full bg-white/30 backdrop-blur-md border border-white/50 shadow-lg transition-all duration-300 ${selectedIdx === null ? 'animate-pulse' : 'scale-105 bg-white/50'}`}>
          <p className="text-blue-900 font-extrabold text-2xl tracking-wide text-center drop-shadow-sm">
            {statusMessage}
          </p>
        </div>
      </div>

      {/* Reservoir */}
      <div className="relative group mt-0">
        <div className="absolute -inset-4 bg-blue-300/40 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="w-56 h-14 bg-white/40 border-2 border-white/60 rounded-t-[40px] flex items-center justify-center relative overflow-hidden glass-jug shadow-[0_-10px_30px_rgba(255,255,255,0.3)]">
          <div className="absolute inset-0 bg-blue-500/30">
            <div className="water-surface-layer"></div>
            <div className="water-surface-layer"></div>
          </div>
          <span className="relative z-10 text-blue-900 font-extrabold tracking-widest uppercase text-sm drop-shadow-md">Nguồn nước vô tận</span>
        </div>
      </div>

      {/* Floating Islands & Jugs */}
      <div className="w-full flex flex-wrap justify-center items-end gap-8 md:gap-16 mt-8">
        {JUGS_CAPACITIES.map((cap, idx) => {
          const isSourceJug = pourAnimation?.from === idx;

          return (
            <Jug
              key={idx}
              ref={setJugRef(idx)}
              id={idx}
              capacity={cap}
              currentVolume={currentVolumes[idx]}
              isSelected={selectedIdx === idx}
              pourStyle={isSourceJug ? pourStyle : undefined}
              onSelect={onJugSelect}
            />
          );
        })}
      </div>

      {/* Action Controls */}
      <div className="flex gap-4 mt-8 glass-panel p-3 rounded-full">
        <button
          type="button"
          className="disabled:opacity-40 disabled:hover:scale-100 px-8 py-4 rounded-full bg-blue-500 text-white hover:bg-blue-400 hover:scale-110 hover:-translate-y-1 transition-all shadow-[0_5px_15px_rgba(59,130,246,0.5)] flex items-center gap-2"
          disabled={selectedIdx === null || isBusy}
          onClick={onFill}
        >
          <span className="material-symbols-outlined text-2xl">format_color_fill</span>
          <span className="font-extrabold text-lg tracking-wide">Bơm đầy</span>
        </button>
        <button
          type="button"
          className="disabled:opacity-40 disabled:hover:scale-100 px-8 py-4 rounded-full bg-red-400 text-white hover:bg-red-300 hover:scale-110 hover:-translate-y-1 transition-all shadow-[0_5px_15px_rgba(248,113,113,0.5)] flex items-center gap-2"
          disabled={selectedIdx === null || isBusy}
          onClick={onEmpty}
        >
          <span className="material-symbols-outlined text-2xl">delete_forever</span>
          <span className="font-extrabold text-lg tracking-wide">Đổ đi</span>
        </button>
      </div>
    </section>
  );
}
