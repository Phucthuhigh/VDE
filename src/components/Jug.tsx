import React from 'react';

export interface JugProps {
  id: number;
  capacity: number;
  currentVolume: number;
  isSelected: boolean;
  pourDirection: 'left' | 'right' | null;
  onSelect: (id: number) => void;
}

const getSizeClasses = (capacity: number) => {
  switch (capacity) {
    case 8:
      return {
        jug: 'w-32 h-48',
        text: 'text-2xl',
        island: 'w-40 h-8',
        islandInner: 'w-36 h-4'
      };
    case 5:
      return {
        jug: 'w-28 h-36',
        text: 'text-xl',
        island: 'w-36 h-6',
        islandInner: 'w-32 h-3'
      };
    case 3:
      return {
        jug: 'w-24 h-24',
        text: 'text-lg',
        island: 'w-32 h-5',
        islandInner: 'w-28 h-2.5'
      };
    default:
      return {
        jug: 'w-24 h-24',
        text: 'text-lg',
        island: 'w-32 h-5',
        islandInner: 'w-28 h-2.5'
      };
  }
};

export const Jug: React.FC<JugProps> = ({
  id,
  capacity,
  currentVolume,
  isSelected,
  pourDirection,
  onSelect
}) => {
  const percentage = (currentVolume / capacity) * 100;
  const sizes = getSizeClasses(capacity);

  let transformStyle = {};
  if (pourDirection === 'right') {
    transformStyle = { transform: 'rotate(25deg) translateY(-20px)' };
  } else if (pourDirection === 'left') {
    transformStyle = { transform: 'rotate(-25deg) translateY(-20px)' };
  }

  const selectedClasses = isSelected ? '!border-4 !border-grass-block shadow-[0_0_25px_rgba(102,187,106,0.6)] scale-110 z-10' : '';

  return (
    <div className="flex flex-col items-center gap-6">
      <div 
        className={`relative ${sizes.jug} glass-jug rounded-b-xl border-t-0 flex flex-col justify-end overflow-hidden cursor-pointer pour-animation hover:shadow-lg hover:shadow-cube-blue/20 ${selectedClasses}`}
        onClick={() => onSelect(id)}
        style={transformStyle}
      >
        <div 
          className="w-full bg-cube-blue/80 transition-all duration-700 ease-out relative" 
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
            <span>{currentVolume}</span>/{capacity}L
          </span>
        </div>
      </div>
      
      {/* Floating Island */}
      <div className={`${sizes.island} bg-tertiary rounded-[50%] shadow-xl relative`}>
        <div className={`absolute -top-1 left-1/2 -translate-x-1/2 ${sizes.islandInner} bg-grass-block rounded-[50%]`}></div>
      </div>
    </div>
  );
};
