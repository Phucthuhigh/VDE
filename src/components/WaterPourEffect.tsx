import React, { useEffect, useRef } from 'react';

interface WaterPourEffectProps {
  targetRect: DOMRect;
  sourceHeight: number;
  pourDirection: 'left' | 'right';
  containerRef: React.RefObject<HTMLElement | null>;
}

export const WaterPourEffect: React.FC<WaterPourEffectProps> = ({
  targetRect,
  sourceHeight,
  pourDirection,
  containerRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerRect = container.getBoundingClientRect();

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    // Stream flows vertically from tilted spout into target jug
    const targetCenterX = targetRect.left + targetRect.width / 2 - containerRect.left;
    const streamX = targetCenterX - (pourDirection === 'right' ? targetRect.width * 0.15 : -targetRect.width * 0.15);
    const streamStartY = targetRect.top - 30 - containerRect.top;
    const streamEndY = targetRect.top + 20 - containerRect.top;
    const streamLength = streamEndY - streamStartY;

    let time = 0;
    const splashParticles: { x: number; y: number; vx: number; vy: number; life: number }[] = [];

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      time += 0.05;

      // Multiple translucent layers for realistic water depth
      for (let layer = 0; layer < 4; layer++) {
        const wobble = Math.sin(time * 6 + layer * 1.5) * (2 + layer * 0.5);
        const width = 10 - layer * 2;
        const alpha = 0.3 - layer * 0.06;

        ctx.beginPath();
        ctx.moveTo(streamX + wobble * 0.3, streamStartY);

        const segments = 14;
        for (let i = 1; i <= segments; i++) {
          const t = i / segments;
          const y = streamStartY + streamLength * t;
          // More wobble lower in the stream
          const waveX = Math.sin(time * 8 + t * 12 + layer) * (3 * t) + wobble * (1 - t * 0.3);
          ctx.lineTo(streamX + waveX, y);
        }

        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Bright core stream
      ctx.beginPath();
      ctx.moveTo(streamX, streamStartY);
      for (let i = 1; i <= 14; i++) {
        const t = i / 14;
        const y = streamStartY + streamLength * t;
        const waveX = Math.sin(time * 8 + t * 12) * (1.5 * t);
        ctx.lineTo(streamX + waveX, y);
      }
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.5)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();

      // White highlight streak
      ctx.beginPath();
      ctx.moveTo(streamX + 2, streamStartY);
      for (let i = 1; i <= 14; i++) {
        const t = i / 14;
        const y = streamStartY + streamLength * t;
        ctx.lineTo(streamX + 2 + Math.sin(time * 8 + t * 12) * t, y);
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Falling droplets along the stream
      if (Math.random() > 0.5) {
        const t = Math.random();
        const py = streamStartY + streamLength * t;
        const px = streamX + (Math.random() - 0.5) * 8;
        splashParticles.push({
          x: px, y: py,
          vx: (Math.random() - 0.5) * 1,
          vy: 2 + Math.random() * 3,
          life: 1,
        });
      }

      // Splash particles at landing zone
      if (Math.random() > 0.4) {
        for (let i = 0; i < 2; i++) {
          splashParticles.push({
            x: streamX + (Math.random() - 0.5) * 14,
            y: streamEndY,
            vx: (Math.random() - 0.5) * 5,
            vy: -Math.random() * 4 - 1.5,
            life: 1,
          });
        }
      }

      for (let i = splashParticles.length - 1; i >= 0; i--) {
        const p = splashParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25;
        p.life -= 0.04;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5 * Math.max(0, p.life), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(125, 211, 252, ${Math.max(0, p.life * 0.6)})`;
        ctx.fill();

        if (p.life <= 0) splashParticles.splice(i, 1);
      }

      // Glow at stream origin
      const topGlow = ctx.createRadialGradient(streamX, streamStartY, 0, streamX, streamStartY, 18);
      topGlow.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
      topGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.beginPath();
      ctx.arc(streamX, streamStartY, 18, 0, Math.PI * 2);
      ctx.fillStyle = topGlow;
      ctx.fill();

      // Splash glow at landing
      const bottomGlow = ctx.createRadialGradient(streamX, streamEndY, 0, streamX, streamEndY, 22);
      bottomGlow.addColorStop(0, 'rgba(125, 211, 252, 0.4)');
      bottomGlow.addColorStop(1, 'rgba(125, 211, 252, 0)');
      ctx.beginPath();
      ctx.arc(streamX, streamEndY, 22, 0, Math.PI * 2);
      ctx.fillStyle = bottomGlow;
      ctx.fill();

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [targetRect, sourceHeight, containerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-[50] pointer-events-none"
    />
  );
};
