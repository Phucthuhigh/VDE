import { useCallback, useEffect, useRef, useState } from 'react';
import { getStarRating } from '../config/gameConfig';

interface UseCountdownTimerOptions {
  totalMs: number;
  onExpire: () => void;
  onStarLoss: () => void;
  onUrgentTick: (remainingSec: number) => void;
}

/**
 * Ticking countdown that only (re)creates its interval when play/pause state
 * changes, not on every tick. The previous implementation depended on the
 * countdown value itself, so React tore down and recreated the interval
 * every single second — wasted work and a source of drift.
 */
export function useCountdownTimer({ totalMs, onExpire, onStarLoss, onUrgentTick }: UseCountdownTimerOptions) {
  const [remainingMs, setRemainingMs] = useState(totalMs);
  const [isPlaying, setIsPlaying] = useState(false);

  // Keep latest callbacks available to the interval without restarting it.
  const callbacksRef = useRef({ onExpire, onStarLoss, onUrgentTick });
  useEffect(() => {
    callbacksRef.current = { onExpire, onStarLoss, onUrgentTick };
  }, [onExpire, onStarLoss, onUrgentTick]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = window.setInterval(() => {
      setRemainingMs((prev) => {
        if (prev <= 1000) {
          setIsPlaying(false);
          callbacksRef.current.onExpire();
          return 0;
        }

        const nextMs = prev - 1000;
        const remainingSec = Math.ceil(nextMs / 1000);
        const currentRating = getStarRating(prev);
        const nextRating = getStarRating(nextMs);

        if (nextRating < currentRating && nextRating > 0) {
          callbacksRef.current.onStarLoss();
        }

        if (nextMs <= 30000) {
          callbacksRef.current.onUrgentTick(remainingSec);
        }

        return nextMs;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const start = useCallback(() => setIsPlaying(true), []);

  const stop = useCallback(() => setIsPlaying(false), []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setRemainingMs(totalMs);
  }, [totalMs]);

  return { remainingMs, isPlaying, start, stop, reset };
}
