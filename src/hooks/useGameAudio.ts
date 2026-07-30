import { useCallback, useRef } from 'react';
import { Howl, Howler } from 'howler';

import gameOverSfx from '../assets/sounds/gameover.m4a';
import takeDamageSfx from '../assets/sounds/take_damage.m4a';
import victorySfx from '../assets/sounds/victory.m4a';
import waterPouringSfx from '../assets/sounds/waterpouring.m4a';

// Howler Web Audio Engine with Audio Sprites & Spatial Panning.
// Instantiated once at module scope so remounts / StrictMode double-invokes
// never create duplicate decoders for the same sound.
const waterHowl = new Howl({
  src: [waterPouringSfx],
  html5: false, // High precision Web Audio API engine
  sprite: {
    scoop: [320, 600],  // Múc nước: start 320ms, duration 600ms
    pour: [1750, 1100], // Đổ nước: start 1750ms, duration 1100ms
  },
});

const victoryHowl = new Howl({
  src: [victorySfx],
  html5: false,
  volume: 0.95,
  sprite: {
    siu: [2850, 1400], // "SIUUUU!" shout: start 2850ms, duration 1400ms
  },
});

const gameOverHowl = new Howl({ src: [gameOverSfx], html5: false, volume: 0.85 });

// Every SFX trigger below is fire-and-forget: a failure to play a sound
// should never break the game, only get logged.
function playSafely(label: string, play: () => void) {
  try {
    play();
  } catch (e) {
    console.error(`${label} SFX failed`, e);
  }
}

/** Centralizes every sound effect the game plays, including spatial panning and the countdown beep synth. */
export function useGameAudio() {
  const damageHowlRef = useRef<Howl | null>(null);

  const playStarLossSFX = useCallback(() => {
    playSafely('Star loss', () => {
      // Previous hit may still be playing; stop and release it before starting a new one.
      damageHowlRef.current?.stop();
      damageHowlRef.current?.unload();

      const sound = new Howl({
        src: [takeDamageSfx],
        html5: false,
        volume: 0.85,
        autoplay: true,
        onend: function (this: Howl) {
          this.unload();
        },
      });
      damageHowlRef.current = sound;

      // Stop after 450ms (1 single hit) and cleanly unload memory.
      window.setTimeout(() => {
        sound.stop();
        sound.unload();
      }, 450);
    });
  }, []);

  const playGameOverSFX = useCallback(() => {
    playSafely('GameOver', () => {
      gameOverHowl.stop();
      gameOverHowl.play();
    });
  }, []);

  const playVictorySFX = useCallback(() => {
    playSafely('Victory', () => {
      victoryHowl.stop();
      const id = victoryHowl.play('siu');
      victoryHowl.volume(0.95, id);
    });
  }, []);

  // Part 1: Múc nước (Howler Audio Sprite + Spatial Panning)
  const playWaterScoopSFX = useCallback((pan = 0) => {
    playSafely('Water scoop', () => {
      waterHowl.stop();
      const id = waterHowl.play('scoop');
      waterHowl.volume(0.85, id);
      waterHowl.stereo(pan, id);
    });
  }, []);

  // Part 2: Đổ nước (Howler Audio Sprite + Spatial Panning)
  const playWaterPourSFX = useCallback((pan = 0) => {
    playSafely('Water pour', () => {
      waterHowl.stop();
      const id = waterHowl.play('pour');
      waterHowl.volume(0.95, id);
      waterHowl.stereo(pan, id);
    });
  }, []);

  // Web Audio API synthesizer for the suspenseful countdown beep/tick (final 30s).
  const playCountdownTickSFX = useCallback((remainingSec: number) => {
    playSafely('Countdown tick', () => {
      const ctx = Howler.ctx;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';

      // 30s -> 11s: 880Hz (A5), 10s -> 1s: 1174Hz (D6)
      const isUrgent = remainingSec <= 10;
      const freq = isUrgent ? 1174 : 880;
      const vol = isUrgent ? 0.12 : 0.08;
      const duration = 0.08;

      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    });
  }, []);

  return {
    playStarLossSFX,
    playGameOverSFX,
    playVictorySFX,
    playWaterScoopSFX,
    playWaterPourSFX,
    playCountdownTickSFX,
  };
}

export type GameAudio = ReturnType<typeof useGameAudio>;
