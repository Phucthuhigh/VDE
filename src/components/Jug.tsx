import React, { forwardRef } from 'react';

export interface JugProps {
  id: number;
  capacity: number;
  currentVolume: number;
  isSelected: boolean;
  pourStyle?: React.CSSProperties;
  onSelect: (id: number) => void;
}

const getSizeClasses = (capacity: number) => {
  switch (capacity) {
    case 8:
      return {
        jug: 'w-48 h-72',
        text: 'text-4xl',
        island: 'w-56 h-12',
        islandInner: 'w-48 h-6'
      };
    case 5:
      return {
        jug: 'w-40 h-56',
        text: 'text-3xl',
        island: 'w-48 h-10',
        islandInner: 'w-40 h-5'
      };
    case 3:
      return {
        jug: 'w-36 h-36',
        text: 'text-2xl',
        island: 'w-44 h-8',
        islandInner: 'w-36 h-4'
      };
    default:
      return {
        jug: 'w-36 h-36',
        text: 'text-2xl',
        island: 'w-44 h-8',
        islandInner: 'w-36 h-4'
      };
  }
};

export const Jug = forwardRef<HTMLDivElement, JugProps>(({
  id,
  capacity,
  currentVolume,
  isSelected,
  pourStyle,
  onSelect
}, ref) => {
  const percentage = (currentVolume / capacity) * 100;
  const sizes = getSizeClasses(capacity);

  const selectedClasses = isSelected ? '!border-4 !border-grass-block shadow-[0_0_25px_rgba(102,187,106,0.6)] scale-110 z-10' : '';

  return (
    <div className="flex flex-col items-center gap-6">
      <div 
        ref={ref}
        className={`relative ${sizes.jug} glass-jug rounded-b-xl border-t-0 flex flex-col justify-end overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-cube-blue/20 ${selectedClasses}`}
        onClick={() => onSelect(id)}
        style={pourStyle || {}}
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
          <span className={`text-on-surface font-black ${sizes.text} drop-shadow-sm`}>
            <span>{Math.round(currentVolume)}</span>/{capacity}L
          </span>
        </div>
      </div>
      
      {/* Floating Island */}
      <div className={`${sizes.island} bg-tertiary rounded-[50%] shadow-xl relative`}>
        <div className={`absolute -top-1 left-1/2 -translate-x-1/2 ${sizes.islandInner} bg-grass-block rounded-[50%]`}></div>
      </div>
    </div>
  );
});

Jug.displayName = 'Jug';
