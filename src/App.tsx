import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Howl } from 'howler';
import { BubblesBackground } from './components/BubblesBackground';
import { QuickRulesSidebar } from './components/QuickRulesSidebar';
import { Jug } from './components/Jug';
import { TutorialModal } from './components/TutorialModal';
import { WinModal, MinecraftHeart } from './components/WinModal';
import { GameOverModal } from './components/GameOverModal';
import { SeaweedAnimation } from './components/SeaweedAnimation';
import { FishAnimation } from './components/FishAnimation';

import gameOverSfx from './assets/sounds/gameover.m4a';
import takeDamageSfx from './assets/sounds/take_damage.m4a';
import victorySfx from './assets/sounds/victory.m4a';
import waterPouringSfx from './assets/sounds/waterpouring.m4a';

function getTarget() {
  const capacities = [4, 6, 7, 1, 2];

  let min = 0;
  let max = capacities.length - 1;
  return capacities[Math.floor(Math.random() * (max - min + 1)) + min];
}

const JUGS_CAP = [8, 5, 3];
const TOTAL_TIME_MS = 180000; // 3 minutes countdown

// Howler Web Audio Engine with Audio Sprites & Spatial Panning (instantiated once outside component)
const waterHowl = new Howl({
  src: [waterPouringSfx],
  html5: false, // High precision Web Audio API engine
  sprite: {
    scoop: [320, 600],  // Múc nước: start 320ms, duration 600ms
    pour: [1750, 1100], // Đổ nước: start 1750ms, duration 1100ms
  }
});

const victoryHowl = new Howl({
  src: [victorySfx],
  html5: false,
  volume: 0.95,
  sprite: {
    siu: [2850, 1400], // "SIUUUU!" shout: start 2850ms, duration 1400ms
  }
});
const gameOverHowl = new Howl({ src: [gameOverSfx], html5: false, volume: 0.85 });

const getStarRating = (remainingMs: number): number => {
  const sec = Math.max(0, Math.ceil(remainingMs / 1000));
  if (sec > 144) return 5;
  if (sec > 108) return 4;
  if (sec > 72) return 3;
  if (sec > 36) return 2;
  if (sec > 0) return 1;
  return 0;
};

function App() {
  const [target, setTarget] = useState(getTarget());
  const [currentVolumes, setCurrentVolumes] = useState<number[]>([0, 0, 0]);
  const [history, setHistory] = useState<number[][]>([]);
  const [moves, setMoves] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isTutorialOpen, setIsTutorialOpen] = useState(true);
  const [isRulesExpanded, setIsRulesExpanded] = useState(true);
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isDamageFlash, setIsDamageFlash] = useState(false);
  const [remainingMs, setRemainingMs] = useState(TOTAL_TIME_MS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pourAnimation, setPourAnimation] = useState<{ from: number, to: number } | null>(null);
  const [_pourPhase, setPourPhase] = useState<'move' | 'pour' | 'un-tilt' | 'return' | null>(null);
  const [pourStyle, setPourStyle] = useState<React.CSSProperties>({});
  const jugRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const gameAreaRef = useRef<HTMLElement | null>(null);

  const setJugRef = useCallback((idx: number) => (el: HTMLDivElement | null) => {
    jugRefs.current[idx] = el;
  }, []);

  const playStarLossSFX = () => {
    try {
      const sound = new Howl({
        src: [takeDamageSfx],
        html5: false,
        volume: 0.85,
        autoplay: true,
        onend: function (this: Howl) {
          this.unload();
        }
      });

      // Stop after 450ms (1 single hit) and cleanly unload memory
      setTimeout(() => {
        sound.stop();
        sound.unload();
      }, 450);
    } catch (e) {
      console.error("Star loss SFX failed", e);
    }
    // Minecraft Damage Screen Tilt & Red Flash Effect
    setIsDamageFlash(true);
    setTimeout(() => {
      setIsDamageFlash(false);
    }, 280);
  };

  const playGameOverSFX = () => {
    try {
      gameOverHowl.stop();
      gameOverHowl.play();
    } catch (e) {
      console.error("GameOver SFX failed", e);
    }
  };

  const playVictorySFX = () => {
    try {
      victoryHowl.stop();
      const id = victoryHowl.play('siu');
      victoryHowl.volume(0.95, id);
    } catch (e) {
      console.error("Victory SFX failed", e);
    }
  };

  // Part 1: Múc nước (Howler Audio Sprite + Spatial Panning)
  const playWaterScoopSFX = (pan = 0) => {
    try {
      waterHowl.stop();
      const id = waterHowl.play('scoop');
      waterHowl.volume(0.85, id);
      waterHowl.stereo(pan, id);
    } catch (e) {
      console.error("Water scoop SFX failed", e);
    }
  };

  // Part 2: Đổ nước (Howler Audio Sprite + Spatial Panning - works consistently on 2nd, 3rd, 10th play)
  const playWaterPourSFX = (pan = 0) => {
    try {
      waterHowl.stop();
      const id = waterHowl.play('pour');
      waterHowl.volume(0.95, id);
      waterHowl.stereo(pan, id);
    } catch (e) {
      console.error("Water pour SFX failed", e);
    }
  };

  // Web Audio API Synthesizer for Suspenseful Countdown Beep/Tick (30s Red Alert)
  const playCountdownTickSFX = (remainingSec: number) => {
    try {
      const ctx = Howler.ctx;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';

      // 30s -> 11s: 880Hz (A5), 10s -> 1s: 1174Hz (D6)
      const isUrgent = remainingSec <= 10;
      const freq = isUrgent ? 1174 : 880;
      const vol = isUrgent ? 0.12 : 0.08;
      const duration = 0.08;

      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.error("Countdown tick SFX failed", e);
    }
  };

  useEffect(() => {
    let interval: number | undefined;
    if (isPlaying && remainingMs > 0) {
      interval = window.setInterval(() => {
        setRemainingMs((prev) => {
          if (prev <= 1000) {
            setIsPlaying(false);
            setIsGameOver(true);
            playGameOverSFX();
            return 0;
          }

          const nextMs = prev - 1000;
          const remainingSec = Math.ceil(nextMs / 1000);
          const currentRating = getStarRating(prev);
          const nextRating = getStarRating(nextMs);

          // Play 1 single hit takeDamage SFX when star rating drops (e.g. 5 stars -> 4 stars)
          if (nextRating < currentRating && nextRating > 0) {
            playStarLossSFX();
          }

          // Play gentle suspenseful ticking SFX in the final 30 seconds (including 3s, 2s, 1s climax)
          if (nextMs <= 30000 && nextMs >= 0) {
            playCountdownTickSFX(remainingSec);
          }

          return nextMs;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, remainingMs]);

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
    // Play Victory SFX
    playVictorySFX();

    // Fireworks effect using canvas-confetti
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random() * 0.6 + 0.2, y: Math.random() * 0.5 + 0.1 } // upper half of screen
      });
    }, 250);
  };

  const saveHistory = () => {
    setHistory((prev) => {
      const newHistory = [...prev, [...currentVolumes]];
      if (newHistory.length > 20) newHistory.shift();
      return newHistory;
    });
  };

  const handleJugSelect = (idx: number) => {
    if (isWinModalOpen || isGameOver) return;
    if (pourAnimation) return; // block during pour animation

    if (selectedIdx === null) {
      setSelectedIdx(idx);
      if (!isPlaying && remainingMs === TOTAL_TIME_MS) setIsPlaying(true);
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
    if (pourAnimation) return; // prevent double-pour

    saveHistory();
    const spaceInTo = JUGS_CAP[to] - currentVolumes[to];
    const amountToPour = Math.min(currentVolumes[from], spaceInTo);

    const fromEl = jugRefs.current[from];
    const toEl = jugRefs.current[to];
    if (!fromEl || !toEl) return;

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    const initialFromVol = currentVolumes[from];
    const initialToVol = currentVolumes[to];
    const finalFromVol = initialFromVol - amountToPour;
    const finalToVol = initialToVol + amountToPour;

    // Calculate movement and tilt positioning
    const targetCenterX = toRect.left + toRect.width / 2;
    const sourceCenterX = fromRect.left + fromRect.width / 2;
    const tiltDeg = 40;
    const tiltRad = (tiltDeg * Math.PI) / 180;
    const tiltSign = from < to ? 1 : -1;

    // Spout offset relative to center-bottom when tilted
    const spoutXOffset = (fromRect.width / 2) * Math.cos(tiltRad) + fromRect.height * Math.sin(tiltRad);
    const spoutYHeight = fromRect.height * Math.cos(tiltRad) - (fromRect.width / 2) * Math.sin(tiltRad);

    // Target spout position (slightly towards center from the edge)
    const desiredSpoutX = targetCenterX - tiltSign * (toRect.width * 0.15);
    const deltaX = desiredSpoutX - sourceCenterX - tiltSign * spoutXOffset;

    // Y displacement so spout is 35px above target jug top
    const deltaY = (toRect.top - 35 + spoutYHeight) - (fromRect.top + fromRect.height);

    // Calculate spatial stereo panning based on jug position (-0.5 left -> +0.5 right)
    const toPan = to === 0 ? -0.5 : to === 2 ? 0.5 : 0;

    setPourAnimation({ from, to });

    // Step 1: Lift and move source jug to the side above target (0ms -> 500ms)
    setPourPhase('move');
    setPourStyle({
      transform: `translateX(${deltaX}px) translateY(${deltaY}px)`,
      transition: 'transform 0.45s cubic-bezier(0.34, 1.2, 0.64, 1)',
      zIndex: 100,
      position: 'relative' as const,
      transformOrigin: 'center bottom',
    });

    // Step 2: Tilt jug to pour water (at 500ms) - Play Part 2: Đổ nước (Spatial Audio)
    setTimeout(() => {
      setPourPhase('pour');
      setPourStyle({
        transform: `translateX(${deltaX}px) translateY(${deltaY}px) rotate(${tiltDeg * tiltSign}deg)`,
        transition: 'transform 0.4s ease-in-out',
        transformOrigin: 'center bottom',
        zIndex: 100,
        position: 'relative' as const,
      });

      playWaterPourSFX(toPan);

      // Gradually transfer water over 800ms (from 600ms to 1400ms)
      const transferStartTime = Date.now();
      const transferDuration = 800;
      const transferInterval = setInterval(() => {
        const elapsed = Date.now() - transferStartTime;
        const progress = Math.min(1, elapsed / transferDuration);

        setCurrentVolumes((prev) => {
          const updated = [...prev];
          updated[from] = initialFromVol - amountToPour * progress;
          updated[to] = initialToVol + amountToPour * progress;
          return updated;
        });

        if (progress >= 1) {
          clearInterval(transferInterval);
        }
      }, 30);
    }, 500);

    // Step 3: Rotate jug back upright while STILL AT TOP (at 1450ms)
    setTimeout(() => {
      setPourPhase('un-tilt');
      setPourStyle({
        transform: `translateX(${deltaX}px) translateY(${deltaY}px) rotate(0deg)`,
        transition: 'transform 0.4s ease-in-out',
        transformOrigin: 'center bottom',
        zIndex: 100,
        position: 'relative' as const,
      });
    }, 1450);

    // Step 4: Glide straight back down to original spot (at 1900ms)
    setTimeout(() => {
      setPourPhase('return');
      setPourStyle({
        transform: 'translateX(0px) translateY(0px) rotate(0deg)',
        transition: 'transform 0.45s ease-in-out',
        zIndex: 100,
        position: 'relative' as const,
        transformOrigin: 'center bottom',
      });
    }, 1900);

    // Step 5: Finalize state & check win (at 2400ms)
    setTimeout(() => {
      setCurrentVolumes((prev) => {
        const finalVols = [...prev];
        finalVols[from] = finalFromVol;
        finalVols[to] = finalToVol;
        checkWin(finalVols);
        return finalVols;
      });
      setMoves((m) => m + 1);
      setPourAnimation(null);
      setPourPhase(null);
      setPourStyle({});
    }, 2400);
  };

  const performAction = (action: 'fill' | 'empty') => {
    if (selectedIdx === null || pourAnimation) return;

    const idx = selectedIdx;
    const startVol = currentVolumes[idx];
    const targetVol = action === 'fill' ? JUGS_CAP[idx] : 0;
    if (startVol === targetVol) return;

    saveHistory();
    setSelectedIdx(null);

    // Play water filling/emptying sound effect using Howler (pour SFX for empty action)
    const jugPan = idx === 0 ? -0.5 : idx === 2 ? 0.5 : 0;
    if (action === 'fill') {
      playWaterScoopSFX(jugPan);
    } else {
      playWaterPourSFX(jugPan);
    }

    // Gradually update volume over 700ms
    const startTime = Date.now();
    const duration = 700;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);

      setCurrentVolumes((prev) => {
        const updated = [...prev];
        updated[idx] = startVol + (targetVol - startVol) * progress;
        return updated;
      });

      if (progress >= 1) {
        clearInterval(interval);
        setCurrentVolumes((prev) => {
          const finalVols = [...prev];
          finalVols[idx] = targetVol;
          checkWin(finalVols);
          return finalVols;
        });
        setMoves((m) => m + 1);
      }
    }, 30);
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
    setRemainingMs(TOTAL_TIME_MS);
    setIsWinModalOpen(false);
    setIsGameOver(false);
    setTarget(getTarget());
  };

  return (
    <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-100 via-cyan-300 to-sky-500 text-on-surface font-body-md min-h-screen overflow-x-hidden relative flex flex-col">
      <BubblesBackground />
      <SeaweedAnimation />
      <FishAnimation />

      {/* Red Alert Suspense Overlay when time is running out (<= 30s) */}
      {isPlaying && remainingMs <= 30000 && remainingMs > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 border-[14px] border-red-500/50 animate-pulse shadow-[inset_0_0_90px_rgba(239,68,68,0.45)] transition-all duration-500" />
      )}

      {/* Minecraft Red Flash & Screen Tilt Damage Effect */}
      {isDamageFlash && (
        <div
          className="fixed inset-0 z-[400] pointer-events-none bg-red-600/40 border-[18px] border-red-600 shadow-[inset_0_0_120px_rgba(220,38,38,0.95)] transition-all duration-75"
          style={{
            transform: 'rotate(-2.5deg) scale(1.02)',
          }}
        />
      )}

      <main className="flex-1 w-full max-w-[1900px] mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 transition-all">
        {/* Left Sidebar / Stats */}
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
                {[1, 2, 3, 4, 5].map((starNum) => {
                  const currentStars = getStarRating(remainingMs);
                  return (
                    <MinecraftHeart
                      key={starNum}
                      isFilled={starNum <= currentStars}
                      className="w-8 h-8 md:w-9 md:h-9"
                    />
                  );
                })}
              </div>
              <span className="text-blue-950 font-extrabold text-sm">
                <span className="text-red-600 text-base font-black">{getStarRating(remainingMs)}/5 Tim</span>
              </span>

              {/* Test Trừ Tim Button (Disabled for Production) */}
              {/* <button
                onClick={() => {
                  setRemainingMs((prev) => Math.max(0, prev - 36000));
                  playStarLossSFX();
                }}
                className="w-full mt-1 py-2 px-3 bg-red-500/20 hover:bg-red-500 text-red-800 hover:text-white text-xs font-bold rounded-xl border border-red-400/50 flex items-center justify-center gap-1.5 transition-all hover:scale-105 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">heart_minus</span> Test Trừ Tim (-1 ❤️)
              </button> */}
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
                  <span className="material-symbols-outlined text-2xl text-blue-900">
                    timer
                  </span>
                  Hạn giờ:
                </span>
                <span className={`font-metadata text-2xl font-bold transition-all px-3 py-1 rounded-xl ${remainingMs <= 30000 || remainingMs === 0 || isGameOver
                  ? 'text-red-600 bg-red-100/95 border-2 border-red-500 animate-timer-tick-sync font-black scale-110 shadow-[0_0_20px_rgba(239,68,68,0.6)]'
                  : 'text-blue-900'
                  }`}>
                  {formatTime(remainingMs)}
                </span>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                className="flex-1 bg-white/70 hover:bg-white text-blue-800 py-4 text-lg rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:hover:bg-white/70"
                onClick={undo}
                disabled={history.length === 0 || isGameOver || isWinModalOpen}
              >
                <span className="material-symbols-outlined">undo</span> Hoàn tác
              </button>
              <button
                className="flex-1 bg-red-400/80 hover:bg-red-400 text-white py-4 text-lg rounded-xl flex items-center justify-center gap-2 transition-all font-bold shadow-md hover:shadow-lg"
                onClick={resetGame}
              >
                <span className="material-symbols-outlined">restart_alt</span> Reset
              </button>
            </div>
          </div>
        </aside>

        {/* Center: Game Area */}
        <section ref={gameAreaRef} className="flex-1 flex flex-col items-center justify-center gap-12 order-1 lg:order-2 relative rounded-3xl p-8 min-h-[600px] z-10">
          {/* Tutorial Button (Top Right) */}
          <button
            onClick={() => setIsTutorialOpen(true)}
            className="absolute top-6 right-6 bg-white/80 hover:bg-white text-blue-600 px-4 py-2 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined">help</span>
            <span className="hidden sm:inline">Hướng dẫn chi tiết</span>
          </button>

          {/* Status Message */}
          <div className="min-h-[4rem] mt-2 -mb-4 flex items-center justify-center z-20">
            <div className={`px-10 py-4 rounded-full bg-white/30 backdrop-blur-md border border-white/50 shadow-lg transition-all duration-300 ${selectedIdx === null ? 'animate-pulse' : 'scale-105 bg-white/50'}`}>
              <p className="text-blue-900 font-extrabold text-2xl tracking-wide text-center drop-shadow-sm">
                {selectedIdx === null
                  ? "Chọn một bình để thao tác"
                  : currentVolumes[selectedIdx] === 0
                    ? `Đang chọn bình ${JUGS_CAP[selectedIdx]}L. Bình rỗng, hãy bấm Bơm đầy nhé!`
                    : `Đang chọn bình ${JUGS_CAP[selectedIdx]}L. Hãy chọn bình khác để rót sang, hoặc đổ đi nhé!`}
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
            {JUGS_CAP.map((cap, idx) => {
              const isSourceJug = pourAnimation && pourAnimation.from === idx;

              return (
                <Jug
                  key={idx}
                  ref={setJugRef(idx)}
                  id={idx}
                  capacity={cap}
                  currentVolume={currentVolumes[idx]}
                  isSelected={selectedIdx === idx}
                  pourStyle={isSourceJug ? pourStyle : undefined}
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
      <WinModal
        isOpen={isWinModalOpen}
        moves={moves}
        stars={getStarRating(remainingMs)}
        timeFormatted={formatTime(TOTAL_TIME_MS - remainingMs)}
        onReset={resetGame}
      />
      <GameOverModal isOpen={isGameOver} onReset={resetGame} />
    </div>
  );
}

export default App;
