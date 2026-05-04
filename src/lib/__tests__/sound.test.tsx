import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useSound } from '../hooks/useSound';

describe('useSound', () => {
  it('returns all sound control functions', () => {
    const { result } = renderHook(() => useSound());
    expect(result.current.initAudio).toBeDefined();
    expect(result.current.playEatSound).toBeDefined();
    expect(result.current.playGameOverSound).toBeDefined();
    expect(result.current.playWinSound).toBeDefined();
  });

  it('initializes audio without crashing', () => {
    const { result } = renderHook(() => useSound());
    expect(() => result.current.initAudio()).not.toThrow();
  });
});
