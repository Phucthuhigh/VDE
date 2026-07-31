import { DIFFICULTIES, DIFFICULTY_LABELS, type Difficulty } from '../config/gameConfig';

interface DifficultySelectProps {
  onSelect: (difficulty: Difficulty) => void;
}

const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  easy: 'Ít bước hơn, phù hợp làm quen.',
  medium: 'Cần suy nghĩ nhiều bước hơn.',
  hard: 'Thử thách nhất, đòi hỏi tính toán kỹ.',
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: 'bg-green-500 hover:bg-green-400',
  medium: 'bg-amber-500 hover:bg-amber-400',
  hard: 'bg-red-500 hover:bg-red-400',
};

export function DifficultySelect({ onSelect }: DifficultySelectProps) {
  return (
    <div className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-md flex flex-col items-center justify-center p-6">
      <div className="glass-panel p-10 rounded-3xl flex flex-col items-center gap-8 max-w-xl w-full">
        <h1 className="text-blue-900 text-3xl md:text-4xl font-black text-center drop-shadow-sm">
          Chọn độ khó
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onSelect(d)}
              className={`flex-1 ${DIFFICULTY_COLORS[d]} text-white rounded-2xl py-6 px-4 flex flex-col items-center gap-2 font-bold shadow-lg hover:scale-105 transition-all`}
            >
              <span className="text-2xl">{DIFFICULTY_LABELS[d]}</span>
              <span className="text-sm font-medium text-white/90 text-center">{DIFFICULTY_DESCRIPTIONS[d]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
