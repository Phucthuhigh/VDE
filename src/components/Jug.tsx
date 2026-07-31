import React, { forwardRef } from 'react';

export interface JugProps {
  id: number;
  capacity: number;
  currentVolume: number;
  isSelected: boolean;
  pourStyle?: React.CSSProperties;
  onSelect: (id: number) => void;
}

// Continuous size scaling so any jug capacity (not just the original 8/5/3
// trio) renders proportionally — calibrated to reproduce the original
// hand-tuned 3L/8L sizes exactly, interpolating/extrapolating in between.
function getJugDimensions(capacity: number) {
  const jugWidth = Math.round(144 + (capacity - 3) * 9.6);
  const jugHeight = Math.round(144 + (capacity - 3) * 28.8);
  const textSizePx = Math.round(24 + (capacity - 3) * 2.4);
  const islandWidth = jugWidth + 32;
  const islandHeight = Math.round(jugWidth * 0.25);
  return {
    jugWidth,
    jugHeight,
    textSizePx,
    islandWidth,
    islandHeight,
    islandInnerWidth: jugWidth,
    islandInnerHeight: Math.round(islandHeight / 2),
  };
}

export const Jug = forwardRef<HTMLDivElement, JugProps>(({
  id,
  capacity,
  currentVolume,
  isSelected,
  pourStyle,
  onSelect
}, ref) => {
  const percentage = (currentVolume / capacity) * 100;
  const dims = getJugDimensions(capacity);

  const selectedClasses = isSelected ? '!border-4 !border-grass-block shadow-[0_0_25px_rgba(102,187,106,0.6)] scale-110 z-10' : '';

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={ref}
        className={`relative glass-jug rounded-b-xl border-t-0 flex flex-col justify-end overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-cube-blue/20 ${selectedClasses}`}
        onClick={() => onSelect(id)}
        style={{ width: dims.jugWidth, height: dims.jugHeight, ...(pourStyle || {}) }}
      >
        <div
          className="w-full bg-cube-blue/80 transition-all duration-100 ease-linear relative"
          style={{ height: `${percentage}%` }}
        >
          {currentVolume > 0 && (
            <>
              <div className="water-surface-layer"></div>
              <div className="water-surface-layer"></div>
            </>
          )}
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-on-surface font-black drop-shadow-sm" style={{ fontSize: dims.textSizePx }}>
            <span>{Math.round(currentVolume)}</span>/{capacity}L
          </span>
        </div>
      </div>

      {/* Floating Island */}
      <div
        className="bg-tertiary rounded-[50%] shadow-xl relative"
        style={{ width: dims.islandWidth, height: dims.islandHeight }}
      >
        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2 bg-grass-block rounded-[50%]"
          style={{ width: dims.islandInnerWidth, height: dims.islandInnerHeight }}
        ></div>
      </div>
    </div>
  );
});

Jug.displayName = 'Jug';
