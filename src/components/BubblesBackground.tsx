import React from 'react';

export const BubblesBackground: React.FC = () => {
  // Generate a random set of bubbles
  const bubbles = Array.from({ length: 50 }).map((_, i) => {
    const size = Math.random() * 60 + 10; // 10px to 70px
    const left = Math.random() * 100; // 0% to 100%
    const animationDuration = Math.random() * 10 + 5; // 5s to 15s
    const animationDelay = Math.random() * 10; // 0s to 10s

    return (
      <div
        key={i}
        className="bubble"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          animationDuration: `${animationDuration}s`,
          animationDelay: `${animationDelay}s`,
        }}
      ></div>
    );
  });

  return (
    <div className="bubbles-container">
      {bubbles}
    </div>
  );
};
