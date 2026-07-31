// Total countdown duration for a round.
export const TOTAL_TIME_MS = 300_000; // 5 minutes

export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard'];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Dễ',
  medium: 'Trung bình',
  hard: 'Khó',
};

interface RoundTarget {
  value: number;
  // Minimum moves to solve, bucketed into a difficulty tier.
  difficulty: Difficulty;
}

interface RoundPreset {
  // Capacities (in liters) of the three jugs used this round.
  capacities: readonly [number, number, number];
  // Valid target volumes for this capacity set: reachable, not equal to any
  // jug's own capacity (that would be a 1-move win), and not a simple
  // pairwise sum/difference of two capacities (guessable at a glance, e.g.
  // 5-3=2 or 3+3=6) — only genuinely non-obvious puzzles are listed.
  targets: readonly RoundTarget[];
}

export const ROUND_PRESETS: readonly RoundPreset[] = [
  {
    capacities: [8, 5, 3],
    targets: [
      { value: 1, difficulty: 'easy' },
      { value: 7, difficulty: 'medium' },
      { value: 4, difficulty: 'medium' },
    ],
  },
  {
    capacities: [9, 5, 4],
    targets: [
      { value: 3, difficulty: 'easy' },
      { value: 6, difficulty: 'medium' },
      { value: 2, difficulty: 'medium' },
      { value: 7, difficulty: 'hard' },
    ],
  },
  {
    capacities: [9, 8, 7],
    targets: [
      { value: 5, difficulty: 'easy' },
      { value: 6, difficulty: 'easy' },
      { value: 3, difficulty: 'medium' },
      { value: 4, difficulty: 'medium' },
    ],
  },
  {
    capacities: [9, 7, 2],
    targets: [
      { value: 1, difficulty: 'easy' },
      { value: 3, difficulty: 'easy' },
      { value: 6, difficulty: 'medium' },
      { value: 8, difficulty: 'hard' },
    ],
  },
];

export interface Round {
  capacities: readonly [number, number, number];
  target: number;
}

// All (preset, target) combos flattened per difficulty, computed once.
const ROUNDS_BY_DIFFICULTY: Record<Difficulty, Round[]> = { easy: [], medium: [], hard: [] };
for (const preset of ROUND_PRESETS) {
  for (const t of preset.targets) {
    ROUNDS_BY_DIFFICULTY[t.difficulty].push({ capacities: preset.capacities, target: t.value });
  }
}

export function pickRandomRound(difficulty: Difficulty): Round {
  const pool = ROUNDS_BY_DIFFICULTY[difficulty];
  return pool[Math.floor(Math.random() * pool.length)];
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

// Stereo panning by jug position on screen: leftmost jug pans left,
// rightmost jug pans right, everything in between stays centered.
export function getStereoPan(jugIdx: number, totalJugs: number): number {
  if (jugIdx === 0) return -0.5;
  if (jugIdx === totalJugs - 1) return 0.5;
  return 0;
}
