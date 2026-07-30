import { useState, useEffect } from 'react';
import { BubblesBackground } from './components/BubblesBackground';
import { QuickRulesSidebar } from './components/QuickRulesSidebar';
import { Jug } from './components/Jug';
import { TutorialModal } from './components/TutorialModal';
import { WinModal } from './components/WinModal';
import { SeaweedAnimation } from './components/SeaweedAnimation';
import { FishAnimation } from './components/FishAnimation';

function getTarget() {
  const capacities = [4, 6, 7, 1, 2];

  let min = 0;
  let max = capacities.length - 1;
  return capacities[Math.floor(Math.random() * (max - min + 1)) + min];
}

const JUGS_CAP = [8, 5, 3];

function App() {
  const [target, setTarget] = useState(getTarget());
  const [currentVolumes, setCurrentVolumes] = useState<number[]>([0, 0, 0]);
  const [history, setHistory] = useState<number[][]>([]);
  const [moves, setMoves] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isTutorialOpen, setIsTutorialOpen] = useState(true);
  const [isRulesExpanded, setIsRulesExpanded] = useState(true);
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [timeMs, setTimeMs] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pourAnimation, setPourAnimation] = useState<{ from: number, to: number } | null>(null);

  useEffect(() => {
    let interval: number | undefined;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setTimeMs((prev) => prev + 1000);
      }, 1000);
    } else if (!isPlaying && timeMs !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeMs]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const checkWin = (volumes: number[]) => {
    if (volumes.includes(target)) {
      setIsPlaying(false);
      setIsWinModalOpen(true);
      spawnConfetti();
    }
  };

  const spawnConfetti = () => {
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = ['#ffd700', '#00ff00', '#00d4ff', '#ff0055'][Math.floor(Math.random() * 4)];
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(confetti);

      const animation = confetti.animate([
        { top: '-10px', opacity: 1 },
        { top: '100vh', opacity: 0, transform: `rotate(${Math.random() * 1000}deg) translateX(${Math.random() * 100 - 50}px)` }
      ], {
        duration: 2000 + Math.random() * 3000,
        easing: 'cubic-bezier(0, .9, .57, 1)'
      });
      animation.onfinish = () => confetti.remove();
    }
  };

  const saveHistory = () => {
    setHistory((prev) => {
      const newHistory = [...prev, [...currentVolumes]];
      if (newHistory.length > 20) newHistory.shift();
      return newHistory;
    });
  };

  const handleJugSelect = (idx: number) => {
    if (isWinModalOpen) return;

    if (selectedIdx === null) {
      setSelectedIdx(idx);
      if (!isPlaying && timeMs === 0) setIsPlaying(true);
    } else if (selectedIdx === idx) {
      setSelectedIdx(null);
    } else {
      pour(selectedIdx, idx);
      setSelectedIdx(null);
    }
  };

  const pour = (from: number, to: number) => {
    if (currentVolumes[from] === 0) return;
    if (currentVolumes[to] === JUGS_CAP[to]) return;

    saveHistory();
    const spaceInTo = JUGS_CAP[to] - currentVolumes[to];
    const amountToPour = Math.min(currentVolumes[from], spaceInTo);

    setPourAnimation({ from, to });

    setTimeout(() => {
      setCurrentVolumes((prev) => {
        const newVols = [...prev];
        newVols[from] -= amountToPour;
        newVols[to] += amountToPour;
        checkWin(newVols);
        return newVols;
      });
      setMoves((m) => m + 1);
      setPourAnimation(null);
    }, 600);
  };

  const performAction = (action: 'fill' | 'empty') => {
    if (selectedIdx === null) return;
    saveHistory();

    setCurrentVolumes((prev) => {
      const newVols = [...prev];
      if (action === 'fill') {
        newVols[selectedIdx] = JUGS_CAP[selectedIdx];
      } else if (action === 'empty') {
        newVols[selectedIdx] = 0;
      }
      checkWin(newVols);
      return newVols;
    });
    setMoves((m) => m + 1);
    setSelectedIdx(null);
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setCurrentVolumes(previous);
    setHistory((prev) => prev.slice(0, -1));
    setMoves((m) => Math.max(0, m - 1));
    setSelectedIdx(null);
  };

  const resetGame = () => {
    setCurrentVolumes([0, 0, 0]);
    setHistory([]);
    setMoves(0);
    setSelectedIdx(null);
    setIsPlaying(false);
    setTimeMs(0);
    setIsWinModalOpen(false);
    setTarget(getTarget());
  };

  return (
    <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-100 via-cyan-300 to-sky-500 text-on-surface font-body-md min-h-screen overflow-x-hidden relative flex flex-col">
      <BubblesBackground />
      <SeaweedAnimation />
      <FishAnimation />
      
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 transition-all">
        {/* Left Sidebar / Stats */}
        <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-6 order-2 lg:order-1 z-10">
          <div className="glass-panel p-6 rounded-2xl isometric-card">
            <h3 className="text-blue-900 font-headline-h2 text-headline-h2 mb-4 drop-shadow-sm">Mục tiêu</h3>
            <div className="flex items-center gap-3 bg-white/40 p-4 rounded-xl shadow-inner border border-white/50">
              <span className="material-symbols-outlined text-blue-700 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
              <div>
                <p className="text-blue-900/80 text-label-sm font-label-sm font-bold">Đong đúng</p>
                <p className="text-blue-900 text-headline-h1 font-headline-h1 drop-shadow-sm">{target} Lít</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4 text-blue-900 drop-shadow-sm">
              <span className="font-metadata text-metadata uppercase tracking-widest font-bold">Bảng điểm</span>
              <span className="material-symbols-outlined">analytics</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-blue-900">
                <span className="font-medium">Số lần đổ nước:</span>
                <span className="font-metadata text-xl font-bold">{moves}</span>
              </div>
              <div className="flex justify-between text-blue-900">
                <span className="font-medium">Thời gian:</span>
                <span className="font-metadata text-xl font-bold">{formatTime(timeMs)}</span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                className="flex-1 bg-white/70 hover:bg-white text-blue-800 py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:hover:bg-white/70"
                onClick={undo}
                disabled={history.length === 0}
              >
                <span className="material-symbols-outlined">undo</span> Hoàn tác
              </button>
              <button
                className="flex-1 bg-red-400/80 hover:bg-red-400 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-md hover:shadow-lg"
                onClick={resetGame}
              >
                <span className="material-symbols-outlined">restart_alt</span> Reset
              </button>
            </div>
          </div>
        </aside>

        {/* Center: Game Area */}
        <section className="flex-1 flex flex-col items-center justify-center gap-12 order-1 lg:order-2 relative rounded-3xl p-8 min-h-[600px] z-10">
          {/* Tutorial Button (Top Right) */}
          <button 
            onClick={() => setIsTutorialOpen(true)}
            className="absolute top-6 right-6 bg-white/80 hover:bg-white text-blue-600 px-4 py-2 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined">help</span>
            <span className="hidden sm:inline">Hướng dẫn chi tiết</span>
          </button>

          {/* Reservoir */}
          <div className="relative group mt-8">
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
            {JUGS_CAP.map((cap, idx) => {
              let pourDirection: 'left' | 'right' | null = null;
              if (pourAnimation && pourAnimation.from === idx) {
                pourDirection = pourAnimation.from < pourAnimation.to ? 'right' : 'left';
              }

              return (
                <Jug
                  key={idx}
                  id={idx}
                  capacity={cap}
                  currentVolume={currentVolumes[idx]}
                  isSelected={selectedIdx === idx}
                  pourDirection={pourDirection}
                  onSelect={handleJugSelect}
                />
              );
            })}
          </div>

          {/* Action Controls */}
          <div className="flex gap-4 mt-8 glass-panel p-3 rounded-full">
            <button
              className="disabled:opacity-40 disabled:hover:scale-100 px-8 py-4 rounded-full bg-blue-500 text-white hover:bg-blue-400 hover:scale-110 hover:-translate-y-1 transition-all shadow-[0_5px_15px_rgba(59,130,246,0.5)] flex items-center gap-2"
              disabled={selectedIdx === null}
              onClick={() => performAction('fill')}
            >
              <span className="material-symbols-outlined text-2xl">format_color_fill</span>
              <span className="font-extrabold text-lg tracking-wide">Bơm đầy</span>
            </button>
            <button
              className="disabled:opacity-40 disabled:hover:scale-100 px-8 py-4 rounded-full bg-red-400 text-white hover:bg-red-300 hover:scale-110 hover:-translate-y-1 transition-all shadow-[0_5px_15px_rgba(248,113,113,0.5)] flex items-center gap-2"
              disabled={selectedIdx === null}
              onClick={() => performAction('empty')}
            >
              <span className="material-symbols-outlined text-2xl">delete_forever</span>
              <span className="font-extrabold text-lg tracking-wide">Đổ đi</span>
            </button>
          </div>
          <div className="h-8">
            <p className={`text-white font-medium text-lg drop-shadow-md transition-all ${selectedIdx === null ? 'animate-pulse opacity-80' : 'opacity-100'}`}>
              {selectedIdx === null 
                ? "Chọn một bình để thao tác" 
                : currentVolumes[selectedIdx] === 0 
                  ? `Đang chọn bình ${JUGS_CAP[selectedIdx]}L. Bình rỗng, hãy bấm Bơm đầy nhé!` 
                  : `Đang chọn bình ${JUGS_CAP[selectedIdx]}L. Hãy chọn bình khác để rót sang, hoặc đổ đi nhé!`}
            </p>
          </div>
        </section>

        {/* Right Sidebar: Quick Rules */}
        <div className="order-3 shrink-0 flex z-20">
          <QuickRulesSidebar 
            isExpanded={isRulesExpanded} 
            onToggle={() => setIsRulesExpanded(!isRulesExpanded)} 
          />
        </div>
      </main>

      <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
      <WinModal isOpen={isWinModalOpen} moves={moves} onReset={resetGame} />
    </div>
  );
}

export default App;
