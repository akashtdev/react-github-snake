import { useCallback, useEffect, useRef } from 'react';

export function useSound(): {
  initAudio: () => void;
  playEatSound: () => void;
  playGameOverSound: () => void;
  playWinSound: () => void;
} {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        if (typeof audioCtxRef.current.close === 'function') {
          audioCtxRef.current.close().catch(() => {});
        }
      }
    };
  }, []);

  const initAudio = useCallback((): void => {
    if (!audioCtxRef.current) {
      try {
        const AudioContextConstructor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

        if (AudioContextConstructor) {
          audioCtxRef.current = new AudioContextConstructor();
        } else {
          console.warn('GitHubSnake: Web Audio API not supported in this browser');
          return;
        }
      } catch (error) {
        console.warn('GitHubSnake: Failed to initialize audio context', error);
        return;
      }
    }

    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume().catch((error) => {
        console.warn('GitHubSnake: Failed to resume audio context', error);
      });
    }
  }, []);

  const playEatSound = useCallback((): void => {
    if (!audioCtxRef.current) return;

    try {
      const ctx = audioCtxRef.current;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.1, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }, []);

  const playGameOverSound = useCallback((): void => {
    if (!audioCtxRef.current) return;

    try {
      const ctx = audioCtxRef.current;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sawtooth';
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);

      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }, []);

  const playWinSound = useCallback((): void => {
    if (!audioCtxRef.current) return;

    try {
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      const playNote = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.1, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };

      playNote(261.63, now, 0.1);
      playNote(329.63, now + 0.1, 0.1);
      playNote(392.0, now + 0.2, 0.1);
      playNote(523.25, now + 0.3, 0.5);
    } catch {}
  }, []);

  return { initAudio, playEatSound, playGameOverSound, playWinSound };
}
