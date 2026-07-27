import { useState, useEffect } from 'react';
import { TopNavBar } from './components/TopNavBar';
import { Jug } from './components/Jug';
import { TutorialModal } from './components/TutorialModal';
import { WinModal } from './components/WinModal';

const JUGS_CAP = [8, 5, 3];
const TARGET = 4;

function App() {
  const [currentVolumes, setCurrentVolumes] = useState<number[]>([0, 0, 0]);
  const [history, setHistory] = useState<number[][]>([]);
  const [moves, setMoves] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isTutorialOpen, setIsTutorialOpen] = useState(true);
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [timeMs, setTimeMs] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pourAnimation, setPourAnimation] = useState<{from: number, to: number} | null>(null);

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
    if (volumes.includes(TARGET)) {
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
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen overflow-x-hidden">
      <TopNavBar onToggleTutorial={() => setIsTutorialOpen(true)} />

      <main className="pt-24 pb-12 px-gutter max-w-max-width mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[calc(100vh-80px)]">
        {/* Left Sidebar / Stats */}
        <aside className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1">
          <div className="bg-white p-6 rounded-xl border border-outline-variant/50 shadow-sm isometric-card">
            <h3 className="text-primary font-headline-h2 text-headline-h2 mb-4">Mục tiêu</h3>
            <div className="flex items-center gap-3 bg-primary-container p-4 rounded-lg">
              <span className="material-symbols-outlined text-cube-blue text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
              <div>
                <p className="text-on-surface-variant text-label-sm font-label-sm">Đong đúng</p>
                <p className="text-on-surface text-headline-h1 font-headline-h1">{TARGET} Lít</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-outline-variant/50 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-on-surface-variant font-metadata text-metadata uppercase tracking-widest">Thống kê</span>
              <span className="material-symbols-outlined text-tertiary">analytics</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Bước đi:</span>
                <span className="text-on-surface font-metadata text-xl font-bold">{moves}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Thời gian:</span>
                <span className="text-on-surface font-metadata text-xl font-bold">{formatTime(timeMs)}</span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button 
                className="flex-1 bg-surface-container-high hover:bg-surface-container-highest text-primary py-3 rounded-lg flex items-center justify-center gap-2 transition-all" 
                onClick={undo}
                disabled={history.length === 0}
              >
                <span className="material-symbols-outlined">undo</span> Hoàn tác
              </button>
              <button 
                className="flex-1 bg-error-container hover:bg-error-container/80 text-error py-3 rounded-lg flex items-center justify-center gap-2 transition-all" 
                onClick={resetGame}
              >
                <span className="material-symbols-outlined">restart_alt</span> Reset
              </button>
            </div>
          </div>
        </aside>

        {/* Center: Game Area */}
        <section className="lg:col-span-9 flex flex-col items-center justify-center gap-12 order-1 lg:order-2 relative">
          {/* Reservoir */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-cube-blue/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-48 h-12 bg-white/40 border-2 border-primary-container rounded-t-3xl flex items-center justify-center relative overflow-hidden glass-jug">
              <div className="absolute inset-0 bg-cube-blue/40 water-surface"></div>
              <span className="relative z-10 text-primary font-bold tracking-tighter uppercase text-sm">Nguồn nước vô tận</span>
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
          <div className="flex gap-4 mt-8 bg-white p-2 rounded-full shadow-lg border border-outline-variant/30">
            <button 
              className="disabled:opacity-30 p-4 rounded-full bg-cube-blue text-white hover:scale-110 transition-transform shadow-md" 
              disabled={selectedIdx === null}
              onClick={() => performAction('fill')}
            >
              <span className="material-symbols-outlined">format_color_fill</span>
            </button>
            <button 
              className="disabled:opacity-30 p-4 rounded-full bg-lava-orange text-white hover:scale-110 transition-transform shadow-md" 
              disabled={selectedIdx === null} 
              onClick={() => performAction('empty')}
            >
              <span className="material-symbols-outlined">delete_forever</span>
            </button>
          </div>
          <p className={`text-on-surface-variant font-metadata mt-2 ${selectedIdx === null ? 'animate-pulse' : ''}`}>
            {selectedIdx === null ? "Chọn một bình để thao tác" : `Đang chọn bình ${JUGS_CAP[selectedIdx]}L. Chọn bình khác để rót vào.`}
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-outline-variant/30 mt-auto bg-white/50">
        <div className="flex flex-col md:flex-row justify-between items-center px-gutter max-w-max-width mx-auto gap-4">
          <p className="text-on-surface-variant font-metadata text-metadata">© 2024 Voxel Water Jug Puzzle. Crafted with Isometric Minimalism.</p>
          <div className="flex gap-6">
            <a className="text-on-surface-variant hover:text-tertiary font-metadata text-metadata" href="#">Điều khoản</a>
            <a className="text-on-surface-variant hover:text-tertiary font-metadata text-metadata" href="#">Bảo mật</a>
            <a className="text-on-surface-variant hover:text-tertiary font-metadata text-metadata" href="#">Cộng đồng</a>
          </div>
        </div>
      </footer>

      <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
      <WinModal isOpen={isWinModalOpen} moves={moves} onReset={resetGame} />
    </div>
  );
}

export default App;
