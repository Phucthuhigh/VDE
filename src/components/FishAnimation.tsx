import React, { useMemo } from 'react';

const FishIcon = ({ color, reverse }: { color: string, reverse: boolean }) => (
  <svg 
    width="40" height="20" viewBox="0 0 40 20" 
    style={{ transform: reverse ? 'scaleX(-1)' : 'none', filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.2))' }}
  >
    {/* Fish Body */}
    <path d="M25,2 C35,2 40,10 40,10 C40,10 35,18 25,18 C15,18 10,14 10,10 C10,6 15,2 25,2 Z" fill={color} />
    {/* Fish Tail */}
    <path d="M12,10 L0,0 L0,20 Z" fill={color} />
    {/* Fish Eye */}
    <circle cx="32" cy="8" r="1.5" fill="black" />
    <circle cx="32.5" cy="7.5" r="0.5" fill="white" />
  </svg>
);

const FISH_COLORS = ['#FF7F50', '#FFD700', '#FF69B4', '#00CED1', '#32CD32'];

export const FishAnimation: React.FC = () => {
  const fishes = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const isRight = Math.random() > 0.5;
      const top = 10 + Math.random() * 80; // 10% to 90% vertically
      const duration = 15 + Math.random() * 20; // 15s to 35s
      const delay = Math.random() * 20;
      const color = FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)];
      const scale = 0.5 + Math.random() * 1.5; // size multiplier
      
      return {
        id: i,
        isRight,
        top,
        duration,
        delay,
        color,
        scale
      };
    });
  }, []);

  return (
    <div className="fish-container">
      {fishes.map(fish => (
        <div 
          key={fish.id} 
          className="fish"
          style={{
            top: `${fish.top}%`,
            animationName: fish.isRight ? 'swimRight' : 'swimLeft',
            animationDuration: `${fish.duration}s`,
            animationDelay: `-${fish.delay}s`,
            opacity: 0.8,
            transform: `scale(${fish.scale})`
          }}
        >
          <div style={{ transform: `scale(${fish.scale})` }}>
            <FishIcon color={fish.color} reverse={!fish.isRight} />
          </div>
        </div>
      ))}
    </div>
  );
};
