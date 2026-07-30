interface DamageOverlayProps {
  isPlaying: boolean;
  remainingMs: number;
  isDamageFlash: boolean;
}

/** Full-screen red-alert border (last 30s) and Minecraft-style damage flash, layered above everything else. */
export function DamageOverlay({ isPlaying, remainingMs, isDamageFlash }: DamageOverlayProps) {
  return (
    <>
      {isPlaying && remainingMs <= 30000 && remainingMs > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 border-[14px] border-red-500/50 animate-pulse shadow-[inset_0_0_90px_rgba(239,68,68,0.45)] transition-all duration-500" />
      )}

      {isDamageFlash && (
        <div className="fixed inset-0 z-[400] pointer-events-none bg-red-600/40 border-[18px] border-red-600 shadow-[inset_0_0_120px_rgba(220,38,38,0.95)] transition-all duration-75" />
      )}
    </>
  );
}
