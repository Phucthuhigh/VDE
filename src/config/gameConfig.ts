// Capacities (in liters) of the three jugs used in every round.
export const JUGS_CAPACITIES = [8, 5, 3] as const;

// Total countdown duration for a round.
export const TOTAL_TIME_MS = 180_000; // 3 minutes

// Candidate target volumes; one is picked at random each round.
// All values are reachable with JUGS_CAPACITIES = [8, 5, 3].
const TARGET_CANDIDATES = [4, 6, 7, 1, 2] as const;

export function pickRandomTarget(): number {
  return TARGET_CANDIDATES[Math.floor(Math.random() * TARGET_CANDIDATES.length)];
}

// Star rating decays as time runs out, in 5 even steps across TOTAL_TIME_MS.
export function getStarRating(remainingMs: number): number {
  const sec = Math.max(0, Math.ceil(remainingMs / 1000));
  if (sec > 144) return 5;
  if (sec > 108) return 4;
  if (sec > 72) return 3;
  if (sec > 36) return 2;
  if (sec > 0) return 1;
  return 0;
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Stereo panning by jug position on screen: leftmost jug (index 0) pans
// left, rightmost jug pans right, middle jug stays centered.
export function getStereoPan(jugIdx: number): number {
  if (jugIdx === 0) return -0.5;
  if (jugIdx === JUGS_CAPACITIES.length - 1) return 0.5;
  return 0;
}
