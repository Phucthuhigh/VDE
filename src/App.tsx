import { useState } from 'react';

import { BubblesBackground } from './components/BubblesBackground';
import { QuickRulesSidebar } from './components/QuickRulesSidebar';
import { TutorialModal } from './components/TutorialModal';
import { WinModal } from './components/WinModal';
import { GameOverModal } from './components/GameOverModal';
import { SeaweedAnimation } from './components/SeaweedAnimation';
import { FishAnimation } from './components/FishAnimation';
import { DamageOverlay } from './components/DamageOverlay';
import { GameStatsPanel } from './components/GameStatsPanel';
import { GameBoard } from './components/GameBoard';

import { TOTAL_TIME_MS, formatTime, getStarRating } from './config/gameConfig';
import { useGameAudio } from './hooks/useGameAudio';
import { useWaterJugGame } from './hooks/useWaterJugGame';

function App() {
  const [isTutorialOpen, setIsTutorialOpen] = useState(true);
  const [isRulesExpanded, setIsRulesExpanded] = useState(true);

  const audio = useGameAudio();
  const game = useWaterJugGame(audio);

  return (
    <div className={`bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-100 via-cyan-300 to-sky-500 text-on-surface font-body-md min-h-screen overflow-x-hidden relative flex flex-col ${game.isDamageFlash ? 'animate-damage-shake' : ''}`}>
      <BubblesBackground />
      <SeaweedAnimation />
      <FishAnimation />

      <DamageOverlay
        isPlaying={game.isPlaying}
        remainingMs={game.remainingMs}
        isDamageFlash={game.isDamageFlash}
      />

      <main className="flex-1 w-full max-w-[1900px] mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 transition-all">
        <GameStatsPanel
          target={game.target}
          moves={game.moves}
          remainingMs={game.remainingMs}
          isGameOver={game.isGameOver}
          isWinModalOpen={game.isWinModalOpen}
          canUndo={game.history.length > 0}
          isBusy={game.isBusy}
          onUndo={game.undo}
          onReset={game.resetGame}
        />

        <GameBoard
          currentVolumes={game.currentVolumes}
          selectedIdx={game.selectedIdx}
          pourAnimation={game.pourAnimation}
          pourStyle={game.pourStyle}
          isBusy={game.isBusy}
          setJugRef={game.setJugRef}
          onJugSelect={game.handleJugSelect}
          onFill={() => game.performAction('fill')}
          onEmpty={() => game.performAction('empty')}
          onOpenTutorial={() => setIsTutorialOpen(true)}
        />

        <div className="order-3 shrink-0 flex z-20">
          <QuickRulesSidebar
            isExpanded={isRulesExpanded}
            onToggle={() => setIsRulesExpanded(!isRulesExpanded)}
          />
        </div>
      </main>

      <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
      <WinModal
        isOpen={game.isWinModalOpen}
        moves={game.moves}
        stars={getStarRating(game.remainingMs)}
        timeFormatted={formatTime(TOTAL_TIME_MS - game.remainingMs)}
        onReset={game.resetGame}
      />
      <GameOverModal isOpen={game.isGameOver} onReset={game.resetGame} />
    </div>
  );
}

export default App;
