import { memo, useMemo, useRef } from 'react';
import { useSnakeContext } from '../context/SnakeContext';
import { useSnakeEngine } from '../hooks/useSnakeEngine';
import type { ContributionData, GitHubSnakeLabels } from '../types';

interface HeatmapBoardProps {
  data?: ContributionData;
  blockSize?: number;
  blockMargin?: number;
  labels?: GitHubSnakeLabels;
  colorScheme?: 'light' | 'dark';
  className?: string;
  style?: React.CSSProperties;
}

export const HeatmapBoard = memo(function HeatmapBoard({
  data,
  blockSize = 15,
  blockMargin = 4,
  labels,
  colorScheme,
  className = '',
  style,
}: HeatmapBoardProps) {
  const { gameState, mode, startGame, boardWidth, boardHeight, score, showScore } =
    useSnakeContext();
  const boardRef = useRef<HTMLDivElement>(null);

  useSnakeEngine(boardRef);

  const grid = useMemo(() => {
    const cells = [];
    let dayIndex = 0;

    for (let x = 0; x < boardWidth; x++) {
      const col = [];
      for (let y = 0; y < boardHeight; y++) {
        const level =
          data?.days && dayIndex < data.days.length ? (data.days[dayIndex]?.level ?? 0) : 0;
        dayIndex++;
        col.push(
          <div
            key={`${x}-${y}`}
            data-x={x}
            data-y={y}
            className={`github-snake-cell level-${level}`}
          />
        );
      }
      cells.push(
        <div key={`col-${x}`} className="github-snake-col">
          {col}
        </div>
      );
    }
    return cells;
  }, [boardWidth, boardHeight, data]);

  const baseClass = useMemo(
    () => `github-snake-container ${gameState !== 'IDLE' ? 'is-playing' : ''} ${className}`,
    [gameState, className]
  );

  const dynamicStyle: React.CSSProperties & { '--cell-size'?: string; '--cell-gap'?: string } =
    useMemo(
      () => ({
        ...style,
        '--cell-size': `${blockSize}px`,
        '--cell-gap': `${blockMargin}px`,
      }),
      [style, blockSize, blockMargin]
    );

  return (
    <div className={baseClass} style={dynamicStyle} data-theme={colorScheme}>
      <div className="github-snake-grid" ref={boardRef}>
        {grid}
      </div>

      {gameState === 'IDLE' && (
        <div className="github-snake-overlay">
          <div className="overlay-content">
            <button
              type="button"
              className="github-snake-btn start-btn"
              onClick={startGame}
              aria-label="Start snake game"
            >
              {labels?.start || 'Start Snake'}
            </button>
            <p className="overlay-hint">
              {mode === 'AUTOMODE' ? 'Automode enabled' : 'Use arrow keys to move'}
            </p>
          </div>
        </div>
      )}

      {gameState === 'GAME_OVER' && (
        <div className="github-snake-overlay is-game-over">
          <div className="overlay-content">
            <h3 className="game-over-text">{labels?.gameOver || 'Game Over'}</h3>
            <p className="score-text">
              {labels?.score || 'Score'}: {score}
            </p>
            <button
              type="button"
              className="github-snake-btn restart-btn"
              onClick={startGame}
              aria-label="Restart snake game"
            >
              {labels?.restart || 'Play Again'}
            </button>
          </div>
        </div>
      )}

      {gameState === 'WON' && (
        <div className="github-snake-overlay is-won">
          <div className="overlay-content">
            <h3 className="game-won-text">{labels?.won || 'Board Cleared!'}</h3>
            <p className="score-text">
              {labels?.score || 'Final Score'}: {score}
            </p>
            <div className="won-actions">
              <button
                type="button"
                className="github-snake-btn restart-btn"
                onClick={startGame}
                aria-label="Play snake game again"
              >
                {labels?.restart || 'Play Again'}
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'PLAYING' && showScore && <div className="score-hud">Score: {score}</div>}
    </div>
  );
});
