import { useCallback, useRef, useState, type CSSProperties } from 'react';
import confetti from 'canvas-confetti';

import { TOTAL_TIME_MS, getStereoPan, pickRandomRound } from '../config/gameConfig';
import type { GameAudio } from './useGameAudio';
import { useCountdownTimer } from './useCountdownTimer';
import { useTrackedTimers } from './useTrackedTimers';

const MAX_HISTORY = 20;
// Must match the `.animate-damage-shake` animation duration in src/index.css,
// which plays the matching screen-shake for the same red flash window.
const DAMAGE_FLASH_MS = 280;

// Pour animation timeline (all offsets in ms from pour start).
const POUR_LIFT_MS = 500;    // jug lifts & travels above the target
const POUR_UNTILT_MS = 1450; // jug rotates back upright
const POUR_RETURN_MS = 1900; // jug glides back to its original spot
const POUR_FINALIZE_MS = 2400; // animation ends, volumes commit
const POUR_TRANSFER_DURATION_MS = 800; // how long the gradual volume transfer takes
const PROGRESS_TICK_MS = 30; // granularity of gradual volume updates

const FILL_EMPTY_DURATION_MS = 700;

const POUR_TILT_DEG = 40;
const SPOUT_CLEARANCE_PX = 35; // vertical gap kept above the target jug's rim
const SPOUT_TARGET_INSET_RATIO = 0.15; // how far the spout aims in from the target jug's edge

const CONFETTI_DURATION_MS = 4000;
const CONFETTI_TICK_MS = 250;

export interface PourAnimationState {
  from: number;
  to: number;
}

interface PourTransform {
  deltaX: number;
  deltaY: number;
  tiltSign: 1 | -1;
  toPan: number;
}

// Pure geometry: figure out how far the source jug must travel and tilt so
// its spout lines up above the target jug, plus which way to pan the SFX.
function calculatePourTransform(fromRect: DOMRect, toRect: DOMRect, from: number, to: number, totalJugs: number): PourTransform {
  const tiltRad = (POUR_TILT_DEG * Math.PI) / 180;
  const tiltSign: 1 | -1 = from < to ? 1 : -1;

  const targetCenterX = toRect.left + toRect.width / 2;
  const sourceCenterX = fromRect.left + fromRect.width / 2;

  // Spout offset relative to center-bottom once the jug is tilted.
  const spoutXOffset = (fromRect.width / 2) * Math.cos(tiltRad) + fromRect.height * Math.sin(tiltRad);
  const spoutYHeight = fromRect.height * Math.cos(tiltRad) - (fromRect.width / 2) * Math.sin(tiltRad);

  // Target spout position (slightly towards center from the target's edge).
  const desiredSpoutX = targetCenterX - tiltSign * (toRect.width * SPOUT_TARGET_INSET_RATIO);
  const deltaX = desiredSpoutX - sourceCenterX - tiltSign * spoutXOffset;
  const deltaY = (toRect.top - SPOUT_CLEARANCE_PX + spoutYHeight) - (fromRect.top + fromRect.height);

  return { deltaX, deltaY, tiltSign, toPan: getStereoPan(to, totalJugs) };
}

// Every pour-animation frame shares the same positioning/stacking rules;
// only the transform and transition timing change per step.
function buildPourStyle(transform: string, transition: string): CSSProperties {
  return {
    transform,
    transition,
    transformOrigin: 'center bottom',
    zIndex: 100,
    position: 'relative',
  };
}

export function useWaterJugGame(audio: GameAudio) {
  // Capacities and target are tied to the same round preset, so they're kept
  // in one state value to guarantee they always change together.
  const [round, setRound] = useState(pickRandomRound);
  const { capacities, target } = round;
  const [currentVolumes, setCurrentVolumes] = useState<number[]>([0, 0, 0]);
  const [history, setHistory] = useState<number[][]>([]);
  const [moves, setMoves] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isDamageFlash, setIsDamageFlash] = useState(false);
  const [isActionBusy, setIsActionBusy] = useState(false);
  const [pourAnimation, setPourAnimation] = useState<PourAnimationState | null>(null);
  const [pourStyle, setPourStyle] = useState<CSSProperties>({});

  const jugRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const setJugRef = useCallback((idx: number) => (el: HTMLDivElement | null) => {
    jugRefs.current[idx] = el;
  }, []);

  const { scheduleTimeout, scheduleInterval, clearTrackedInterval, clearAllPendingTimers } = useTrackedTimers();

  const triggerStarLossEffects = useCallback(() => {
    audio.playStarLossSFX();
    // Minecraft damage screen tilt & red flash effect.
    setIsDamageFlash(true);
    scheduleTimeout(() => setIsDamageFlash(false), DAMAGE_FLASH_MS);
  }, [audio, scheduleTimeout]);

  const handleExpire = useCallback(() => {
    setIsGameOver(true);
    audio.playGameOverSFX();
  }, [audio]);

  // Destructured (rather than kept as one `timer` object) so callbacks below
  // only re-create when a value they actually use changes — `start`/`stop`/
  // `reset` are stable across renders, unlike a fresh object literal would be.
  const {
    remainingMs,
    isPlaying,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer,
  } = useCountdownTimer({
    totalMs: TOTAL_TIME_MS,
    onExpire: handleExpire,
    onStarLoss: triggerStarLossEffects,
    onUrgentTick: audio.playCountdownTickSFX,
  });

  const spawnConfetti = useCallback(() => {
    audio.playVictorySFX();

    const animationEnd = Date.now() + CONFETTI_DURATION_MS;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    const intervalId = scheduleInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearTrackedInterval(intervalId);
        return;
      }
      const particleCount = 50 * (timeLeft / CONFETTI_DURATION_MS);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random() * 0.6 + 0.2, y: Math.random() * 0.5 + 0.1 }, // upper half of screen
      });
    }, CONFETTI_TICK_MS);
  }, [audio, scheduleInterval, clearTrackedInterval]);

  const checkWin = useCallback((volumes: number[]) => {
    if (volumes.includes(target)) {
      stopTimer();
      setIsWinModalOpen(true);
      spawnConfetti();
    }
  }, [target, stopTimer, spawnConfetti]);

  const saveHistory = useCallback(() => {
    setHistory((prev) => {
      const newHistory = [...prev, [...currentVolumes]];
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      return newHistory;
    });
  }, [currentVolumes]);

  const pour = useCallback((from: number, to: number) => {
    if (currentVolumes[from] === 0) return;
    if (currentVolumes[to] === capacities[to]) return;
    // Block re-entrancy from another in-flight pour, and from a fill/empty
    // animation still running on some jug — both write to `currentVolumes`
    // via their own interval, and if they targeted the same index the two
    // writers would race and leave that jug's volume corrupted.
    if (pourAnimation || isActionBusy) return;

    saveHistory();
    const spaceInTo = capacities[to] - currentVolumes[to];
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

    const { deltaX, deltaY, tiltSign, toPan } = calculatePourTransform(fromRect, toRect, from, to, capacities.length);

    setPourAnimation({ from, to });

    // Step 1: Lift and move source jug to the side above target (0ms -> POUR_LIFT_MS).
    setPourStyle(buildPourStyle(
      `translateX(${deltaX}px) translateY(${deltaY}px)`,
      'transform 0.45s cubic-bezier(0.34, 1.2, 0.64, 1)',
    ));

    // Step 2: Tilt jug to pour water + spatial pour SFX.
    scheduleTimeout(() => {
      setPourStyle(buildPourStyle(
        `translateX(${deltaX}px) translateY(${deltaY}px) rotate(${POUR_TILT_DEG * tiltSign}deg)`,
        'transform 0.4s ease-in-out',
      ));

      audio.playWaterPourSFX(toPan);

      // Gradually transfer water over POUR_TRANSFER_DURATION_MS.
      const transferStartTime = Date.now();
      const transferIntervalId = scheduleInterval(() => {
        const elapsed = Date.now() - transferStartTime;
        const progress = Math.min(1, elapsed / POUR_TRANSFER_DURATION_MS);

        setCurrentVolumes((prev) => {
          const updated = [...prev];
          updated[from] = initialFromVol - amountToPour * progress;
          updated[to] = initialToVol + amountToPour * progress;
          return updated;
        });

        if (progress >= 1) {
          clearTrackedInterval(transferIntervalId);
        }
      }, PROGRESS_TICK_MS);
    }, POUR_LIFT_MS);

    // Step 3: Rotate jug back upright while still at the top.
    scheduleTimeout(() => {
      setPourStyle(buildPourStyle(
        `translateX(${deltaX}px) translateY(${deltaY}px) rotate(0deg)`,
        'transform 0.4s ease-in-out',
      ));
    }, POUR_UNTILT_MS);

    // Step 4: Glide straight back down to the original spot.
    scheduleTimeout(() => {
      setPourStyle(buildPourStyle('translateX(0px) translateY(0px) rotate(0deg)', 'transform 0.45s ease-in-out'));
    }, POUR_RETURN_MS);

    // Step 5: Finalize state & check win.
    scheduleTimeout(() => {
      setCurrentVolumes((prev) => {
        const finalVols = [...prev];
        finalVols[from] = finalFromVol;
        finalVols[to] = finalToVol;
        checkWin(finalVols);
        return finalVols;
      });
      setMoves((m) => m + 1);
      setPourAnimation(null);
      setPourStyle({});
    }, POUR_FINALIZE_MS);
  }, [currentVolumes, capacities, pourAnimation, isActionBusy, saveHistory, audio, scheduleTimeout, scheduleInterval, clearTrackedInterval, checkWin]);

  const handleJugSelect = useCallback((idx: number) => {
    if (isWinModalOpen || isGameOver) return;
    if (pourAnimation) return; // block during pour animation

    if (selectedIdx === null) {
      setSelectedIdx(idx);
      if (!isPlaying && remainingMs === TOTAL_TIME_MS) startTimer();
    } else if (selectedIdx === idx) {
      setSelectedIdx(null);
    } else {
      pour(selectedIdx, idx);
      setSelectedIdx(null);
    }
  }, [isWinModalOpen, isGameOver, pourAnimation, selectedIdx, isPlaying, remainingMs, startTimer, pour]);

  const performAction = useCallback((action: 'fill' | 'empty') => {
    if (selectedIdx === null || pourAnimation || isActionBusy) return;

    const idx = selectedIdx;
    const startVol = currentVolumes[idx];
    const targetVol = action === 'fill' ? capacities[idx] : 0;
    if (startVol === targetVol) return;

    saveHistory();
    setSelectedIdx(null);
    setIsActionBusy(true);

    const jugPan = getStereoPan(idx, capacities.length);
    if (action === 'fill') {
      audio.playWaterScoopSFX(jugPan);
    } else {
      audio.playWaterPourSFX(jugPan);
    }

    // Gradually update volume over FILL_EMPTY_DURATION_MS.
    const startTime = Date.now();
    const intervalId = scheduleInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / FILL_EMPTY_DURATION_MS);

      setCurrentVolumes((prev) => {
        const updated = [...prev];
        updated[idx] = startVol + (targetVol - startVol) * progress;
        return updated;
      });

      if (progress >= 1) {
        clearTrackedInterval(intervalId);
        setCurrentVolumes((prev) => {
          const finalVols = [...prev];
          finalVols[idx] = targetVol;
          checkWin(finalVols);
          return finalVols;
        });
        setMoves((m) => m + 1);
        setIsActionBusy(false);
      }
    }, PROGRESS_TICK_MS);
  }, [selectedIdx, pourAnimation, isActionBusy, currentVolumes, capacities, saveHistory, audio, scheduleInterval, clearTrackedInterval, checkWin]);

  const undo = useCallback(() => {
    if (history.length === 0 || pourAnimation || isActionBusy) return;
    const previous = history[history.length - 1];
    setCurrentVolumes(previous);
    setHistory((prev) => prev.slice(0, -1));
    setMoves((m) => Math.max(0, m - 1));
    setSelectedIdx(null);
  }, [history, pourAnimation, isActionBusy]);

  const resetGame = useCallback(() => {
    // Cancel any in-flight pour/fill/empty/confetti timers so their late
    // callbacks can't clobber the freshly-reset state below.
    clearAllPendingTimers();

    setCurrentVolumes([0, 0, 0]);
    setHistory([]);
    setMoves(0);
    setSelectedIdx(null);
    setPourAnimation(null);
    setPourStyle({});
    setIsActionBusy(false);
    setIsDamageFlash(false);
    resetTimer();
    setIsWinModalOpen(false);
    setIsGameOver(false);
    setRound(pickRandomRound());
  }, [clearAllPendingTimers, resetTimer]);

  return {
    target,
    capacities,
    currentVolumes,
    history,
    moves,
    selectedIdx,
    isWinModalOpen,
    isGameOver,
    isDamageFlash,
    isBusy: pourAnimation !== null || isActionBusy,
    pourAnimation,
    pourStyle,
    remainingMs,
    isPlaying,
    setJugRef,
    handleJugSelect,
    performAction,
    undo,
    resetGame,
  };
}
