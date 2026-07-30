import { MinecraftHeart } from './WinModal';
import { formatTime, getStarRating } from '../config/gameConfig';

interface GameStatsPanelProps {
  target: number;
  moves: number;
  remainingMs: number;
  isGameOver: boolean;
  isWinModalOpen: boolean;
  canUndo: boolean;
  isBusy: boolean;
  onUndo: () => void;
  onReset: () => void;
}

export function GameStatsPanel({
  target,
  moves,
  remainingMs,
  isGameOver,
  isWinModalOpen,
  canUndo,
  isBusy,
  onUndo,
  onReset,
}: GameStatsPanelProps) {
  const stars = getStarRating(remainingMs);
  const isUrgent = remainingMs <= 30000 || isGameOver;

  return (
    <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6 order-2 lg:order-1 z-10">
      <div className="glass-panel p-8 rounded-3xl isometric-card">
        <h3 className="text-blue-900 text-3xl font-headline-h2 font-bold mb-6 drop-shadow-sm">Mục tiêu</h3>
        <div className="flex items-center gap-4 bg-white/40 p-5 rounded-2xl shadow-inner border border-white/50">
          <span className="material-symbols-outlined text-blue-700 text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
          <div>
            <p className="text-blue-900/80 text-lg font-label-sm font-bold">Đong đúng</p>
            <p className="text-blue-900 text-3xl font-headline-h1 font-black drop-shadow-sm">{target}L</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-3xl">
        <div className="flex justify-between items-center mb-4 text-blue-900 drop-shadow-sm">
          <span className="font-metadata text-lg uppercase tracking-widest font-bold">Bảng điểm</span>
          <span className="material-symbols-outlined text-3xl">analytics</span>
        </div>

        {/* Minecraft Hearts Display */}
        <div className="mb-5 bg-white/40 p-4 rounded-2xl border border-white/50 flex flex-col items-center gap-3 shadow-inner">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((starNum) => (
              <MinecraftHeart
                key={starNum}
                isFilled={starNum <= stars}
                className="w-8 h-8 md:w-9 md:h-9"
              />
            ))}
          </div>
          <span className="text-blue-950 font-extrabold text-sm">
            <span className="text-red-600 text-base font-black">{stars}/5 Tim</span>
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-blue-900 items-center">
            <span className="font-medium text-lg flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xl">touch_app</span> Số bước:
            </span>
            <span className="font-metadata text-2xl font-bold">{moves}</span>
          </div>
          <div className="flex justify-between text-blue-900 items-center">
            <span className="font-medium text-lg flex items-center gap-1.5">
              <span className="material-symbols-outlined text-2xl text-blue-900">timer</span>
              Hạn giờ:
            </span>
            <span className={`font-metadata text-2xl font-bold transition-all px-3 py-1 rounded-xl ${isUrgent
              ? 'text-red-600 bg-red-100/95 border-2 border-red-500 animate-timer-tick-sync font-black scale-110 shadow-[0_0_20px_rgba(239,68,68,0.6)]'
              : 'text-blue-900'
              }`}>
              {formatTime(remainingMs)}
            </span>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            className="flex-1 bg-white/70 hover:bg-white text-blue-800 py-4 text-lg rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:hover:bg-white/70"
            onClick={onUndo}
            disabled={!canUndo || isGameOver || isWinModalOpen || isBusy}
          >
            <span className="material-symbols-outlined">undo</span> Hoàn tác
          </button>
          <button
            type="button"
            className="flex-1 bg-red-400/80 hover:bg-red-400 text-white py-4 text-lg rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-md hover:shadow-lg"
            onClick={onReset}
          >
            <span className="material-symbols-outlined">restart_alt</span> Chơi lại
          </button>
        </div>
      </div>
    </aside>
  );
}
