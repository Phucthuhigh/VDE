import React, { useMemo } from 'react';

const SeaweedIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 60 200" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>
    <path d="M20 200 Q50 150 25 100 Q0 50 30 0 Q60 50 35 100 Q10 150 40 200 Z" fill={color} />
  </svg>
);

const KelpIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 40 300" width="100%" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>
    <path d="M15 300 Q30 250 10 200 Q-5 150 20 100 Q35 50 15 0 Q25 50 10 100 Q30 150 5 200 Q20 250 25 300 Z" fill={color} />
  </svg>
);

const CoralIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>
    <path d="M50 100 C50 80, 20 80, 10 60 C5 50, 15 40, 25 50 C30 55, 45 70, 50 80 C50 80, 50 50, 40 30 C35 20, 45 10, 55 20 C60 25, 55 50, 55 80 C55 80, 80 70, 90 50 C95 40, 105 50, 95 60 C85 75, 60 90, 55 100 Z" fill={color} />
  </svg>
);

const StarfishIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
    <polygon points="50,5 65,35 95,35 70,55 80,85 50,65 20,85 30,55 5,35 35,35" fill={color} stroke="rgba(0,0,0,0.1)" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="50" cy="50" r="3" fill="rgba(255,255,255,0.5)"/>
  </svg>
);

const JellyfishIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 100 150" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
    <path d="M20 60 Q50 0 80 60 Z" fill={color} opacity="0.8" />
    <path d="M20 60 Q35 70 50 60 Q65 70 80 60 Q65 50 50 60 Q35 50 20 60 Z" fill={color} opacity="0.9" />
    <path d="M30 65 Q25 100 35 140" fill="none" stroke={color} strokeWidth="3" opacity="0.6" strokeLinecap="round" />
    <path d="M50 65 Q60 110 50 150" fill="none" stroke={color} strokeWidth="3" opacity="0.6" strokeLinecap="round" />
    <path d="M70 65 Q75 100 65 140" fill="none" stroke={color} strokeWidth="3" opacity="0.6" strokeLinecap="round" />
  </svg>
);

const PLANT_COLORS = ['#2e8b57', '#3cb371', '#228b22', '#00fa9a', '#20b2aa'];
const CORAL_COLORS = ['#ff7f50', '#ff6347', '#ff4500', '#db7093', '#c71585', '#ffb6c1'];
const STARFISH_COLORS = ['#ff8c00', '#ffa500', '#ffd700', '#ff69b4'];
const JELLYFISH_COLORS = ['#dda0dd', '#da70d6', '#ba55d3', '#87cefa', '#e0ffff'];

type SeaLifeType = 'seaweed' | 'kelp' | 'coral' | 'starfish' | 'jellyfish';

export const SeaweedAnimation: React.FC = () => {
  const seaLifeItems = useMemo(() => {
    // We generate a mix of items
    const items: { id: number, type: SeaLifeType, left: number, width: number, height: number, duration: number, delay: number, opacity: number, zIndex: number, color: string }[] = [];
    
    // 10 Seaweed
    for (let i = 0; i < 10; i++) {
      items.push({
        id: items.length,
        type: 'seaweed',
        left: Math.random() * 100,
        height: 100 + Math.random() * 150,
        width: 20 + Math.random() * 30,
        duration: 4 + Math.random() * 3,
        delay: Math.random() * -10,
        opacity: 0.6 + Math.random() * 0.4,
        zIndex: Math.random() > 0.5 ? 5 : 0,
        color: PLANT_COLORS[Math.floor(Math.random() * PLANT_COLORS.length)]
      });
    }

    // 6 Kelp
    for (let i = 0; i < 6; i++) {
      items.push({
        id: items.length,
        type: 'kelp',
        left: Math.random() * 100,
        height: 200 + Math.random() * 200,
        width: 30 + Math.random() * 20,
        duration: 5 + Math.random() * 4,
        delay: Math.random() * -10,
        opacity: 0.5 + Math.random() * 0.4,
        zIndex: Math.random() > 0.5 ? 5 : 0,
        color: PLANT_COLORS[Math.floor(Math.random() * PLANT_COLORS.length)]
      });
    }

    // 5 Corals
    for (let i = 0; i < 5; i++) {
      items.push({
        id: items.length,
        type: 'coral',
        left: Math.random() * 100,
        height: 40 + Math.random() * 60,
        width: 40 + Math.random() * 60,
        duration: 6 + Math.random() * 4, // Very slow sway
        delay: Math.random() * -10,
        opacity: 0.8 + Math.random() * 0.2,
        zIndex: Math.random() > 0.5 ? 6 : 1,
        color: CORAL_COLORS[Math.floor(Math.random() * CORAL_COLORS.length)]
      });
    }

    // 3 Starfish
    for (let i = 0; i < 3; i++) {
      items.push({
        id: items.length,
        type: 'starfish',
        left: Math.random() * 90 + 5,
        height: 30 + Math.random() * 20,
        width: 30 + Math.random() * 20,
        duration: 4 + Math.random() * 2,
        delay: Math.random() * -5,
        opacity: 0.9,
        zIndex: 7,
        color: STARFISH_COLORS[Math.floor(Math.random() * STARFISH_COLORS.length)]
      });
    }

    // 4 Jellyfish
    for (let i = 0; i < 4; i++) {
      items.push({
        id: items.length,
        type: 'jellyfish',
        left: Math.random() * 90 + 5,
        height: 40 + Math.random() * 30,
        width: 40 + Math.random() * 30,
        duration: 15 + Math.random() * 15, // Slow float
        delay: Math.random() * 20,
        opacity: 0.8,
        zIndex: 8,
        color: JELLYFISH_COLORS[Math.floor(Math.random() * JELLYFISH_COLORS.length)]
      });
    }

    return items;
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
      {seaLifeItems.map(item => {
        if (item.type === 'jellyfish') {
          return (
            <div 
              key={item.id}
              className="absolute animate-jellyfish"
              style={{
                left: `${item.left}%`,
                width: `${item.width}px`,
                height: `${item.height}px`,
                zIndex: item.zIndex,
                animationDuration: `${item.duration}s`,
                animationDelay: `-${item.delay}s`,
              }}
            >
              <JellyfishIcon color={item.color} />
            </div>
          );
        }

        if (item.type === 'starfish') {
          return (
            <div 
              key={item.id}
              className="absolute bottom-1 animate-starfish"
              style={{
                left: `${item.left}%`,
                width: `${item.width}px`,
                height: `${item.height}px`,
                zIndex: item.zIndex,
                opacity: item.opacity,
                animationDuration: `${item.duration}s`,
                animationDelay: `-${item.delay}s`,
              }}
            >
              <StarfishIcon color={item.color} />
            </div>
          );
        }

        return (
          <div 
            key={item.id}
            className="absolute bottom-[-10px] origin-bottom animate-sway"
            style={{
              left: `${item.left}%`,
              width: `${item.width}px`,
              height: `${item.height}px`,
              opacity: item.opacity,
              zIndex: item.zIndex,
              animationDuration: `${item.duration}s`,
              animationDelay: `${item.delay}s`,
            }}
          >
            {item.type === 'seaweed' && <SeaweedIcon color={item.color} />}
            {item.type === 'kelp' && <KelpIcon color={item.color} />}
            {item.type === 'coral' && <CoralIcon color={item.color} />}
          </div>
        );
      })}
    </div>
  );
};
