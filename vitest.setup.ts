import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// 1. Better Global Mocks using vi.stubGlobal
vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) =>
  setTimeout(() => callback(performance.now()), 16)
);

vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));

// 2. Mocking Audio with a clean object
vi.stubGlobal(
  'Audio',
  vi.fn().mockImplementation(() => ({
    play: vi.fn(),
    pause: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
);

// 3. Professional Class-based AudioContext Mock
class MockAudioContext {
  currentTime = 0;
  destination = {};
  decodeAudioData = vi.fn();

  createOscillator = vi.fn().mockReturnValue({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: { value: 0 },
  });

  createGain = vi.fn().mockReturnValue({
    connect: vi.fn(),
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
  });

  close = vi.fn().mockResolvedValue(undefined);
}

vi.stubGlobal('AudioContext', MockAudioContext);
vi.stubGlobal('webkitAudioContext', MockAudioContext);
