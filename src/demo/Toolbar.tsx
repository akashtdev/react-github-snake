import { memo, useCallback } from 'react';
import { useSnakeContext } from '../lib/context/SnakeContext';

interface IdentityToolbarProps {
  username: string;
  setUsername: (u: string) => void;
  onFetch: () => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  loading: boolean;
}

export const IdentityToolbar = memo(function IdentityToolbar({
  username,
  setUsername,
  onFetch,
  theme,
  setTheme,
  loading,
}: IdentityToolbarProps) {
  const { gameState } = useSnakeContext();
  const isPlaying = gameState === 'PLAYING';
  const canChangeFetch = !isPlaying;

  const handleUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value);
    },
    [setUsername]
  );

  return (
    <div className="toolbar-row secondary">
      <div className="input-group">
        <input
          id="username-input"
          name="username"
          type="text"
          className="minimal-input"
          value={username}
          onChange={handleUsernameChange}
          disabled={!canChangeFetch || loading}
          placeholder="akashtdev"
          autoComplete="off"
          spellCheck={false}
          aria-label="GitHub username"
        />
        <button
          type="button"
          className="minimal-btn"
          onClick={onFetch}
          disabled={!canChangeFetch || loading || !username}
        >
          {loading ? 'fetching' : 'fetch'}
        </button>
      </div>

      <div className="pill-group">
        <button
          type="button"
          className={`pill-btn ${theme === 'light' ? 'active' : ''}`}
          onClick={() => setTheme('light')}
          aria-label="Light theme"
        >
          <span className="theme-text">Light</span>
          <svg
            className="theme-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="Sun icon"
          >
            <title>Light Mode</title>
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </button>
        <button
          type="button"
          className={`pill-btn ${theme === 'dark' ? 'active' : ''}`}
          onClick={() => setTheme('dark')}
          aria-label="Dark theme"
        >
          <span className="theme-text">Dark</span>
          <svg
            className="theme-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="Moon icon"
          >
            <title>Dark Mode</title>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
      </div>
    </div>
  );
});

export const ControlsToolbar = memo(function ControlsToolbar() {
  const {
    mode,
    setMode,
    speed,
    setSpeed,
    walls,
    setWalls,
    sound,
    setSound,
    grow,
    setGrow,
    showScore,
    setShowScore,
    gameState,
  } = useSnakeContext();

  const isPlaying = gameState === 'PLAYING';
  const canChangeWalls = !isPlaying;
  const canChangeGrow = !isPlaying;

  const handleSpeedChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSpeed(320 - Number(e.target.value));
    },
    [setSpeed]
  );

  return (
    <div className="toolbar-row primary">
      <div className="pill-group mode-pill">
        <button
          type="button"
          className={`pill-btn ${mode === 'MANUAL' ? 'active' : ''}`}
          onClick={() => setMode('MANUAL')}
        >
          Manual
        </button>
        <button
          type="button"
          className={`pill-btn ${mode === 'AUTOMODE' ? 'active' : ''}`}
          onClick={() => setMode('AUTOMODE')}
        >
          Automode
        </button>
      </div>

      <div className="speed-group">
        <span className="control-label">Speed</span>
        <input
          type="range"
          min="20"
          max="300"
          step="10"
          value={320 - speed}
          onChange={handleSpeedChange}
          className="aesthetic-range"
        />
      </div>

      <div className="switch-group">
        <label
          htmlFor="walls-switch"
          className={`compact-switch ${!canChangeWalls ? 'disabled' : ''}`}
        >
          <input
            id="walls-switch"
            type="checkbox"
            checked={walls}
            onChange={(e) => setWalls(e.target.checked)}
            disabled={!canChangeWalls}
          />
          <span className="switch-label">Walls</span>
        </label>

        <label htmlFor="audio-switch" className="compact-switch">
          <input
            id="audio-switch"
            type="checkbox"
            checked={sound}
            onChange={(e) => setSound(e.target.checked)}
          />
          <span className="switch-label">Audio</span>
        </label>

        <label
          htmlFor="grow-switch"
          className={`compact-switch ${!canChangeGrow ? 'disabled' : ''}`}
        >
          <input
            id="grow-switch"
            type="checkbox"
            checked={grow}
            onChange={(e) => setGrow(e.target.checked)}
            disabled={!canChangeGrow}
          />
          <span className="switch-label">Grow</span>
        </label>

        <label htmlFor="score-switch" className="compact-switch">
          <input
            id="score-switch"
            type="checkbox"
            checked={showScore}
            onChange={(e) => setShowScore(e.target.checked)}
          />
          <span className="switch-label">Score</span>
        </label>
      </div>
    </div>
  );
});
