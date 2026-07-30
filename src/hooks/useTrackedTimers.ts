import { useCallback, useEffect, useRef } from 'react';

/**
 * setTimeout/setInterval helpers that remember every id they hand out so
 * callers can cancel all of them at once (e.g. on Reset, Undo, or unmount).
 *
 * This exists because the original pour/fill/empty animations scheduled raw
 * setTimeout/setInterval calls that kept running even after a Reset — late
 * callbacks would then overwrite freshly-reset game state.
 */
export function useTrackedTimers() {
  const timeoutIdsRef = useRef<Set<number>>(new Set());
  const intervalIdsRef = useRef<Set<number>>(new Set());

  const scheduleTimeout = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timeoutIdsRef.current.delete(id);
      fn();
    }, ms);
    timeoutIdsRef.current.add(id);
    return id;
  }, []);

  const scheduleInterval = useCallback((fn: () => void, ms: number) => {
    const id = window.setInterval(fn, ms);
    intervalIdsRef.current.add(id);
    return id;
  }, []);

  const clearTrackedInterval = useCallback((id: number) => {
    window.clearInterval(id);
    intervalIdsRef.current.delete(id);
  }, []);

  const clearAllPendingTimers = useCallback(() => {
    timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutIdsRef.current.clear();
    intervalIdsRef.current.forEach((id) => window.clearInterval(id));
    intervalIdsRef.current.clear();
  }, []);

  // Cancel everything on unmount so no stray callback fires after the
  // component is gone.
  useEffect(() => clearAllPendingTimers, [clearAllPendingTimers]);

  return { scheduleTimeout, scheduleInterval, clearTrackedInterval, clearAllPendingTimers };
}
