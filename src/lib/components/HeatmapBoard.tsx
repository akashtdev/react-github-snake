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
  showLabels?: boolean;
  showLegend?: boolean;
  scrollable?: boolean;
  style?: React.CSSProperties;
}

export const HeatmapBoard = memo(function HeatmapBoard({
  data,
  blockSize = 15,
  blockMargin = 4,
  labels,
  colorScheme,
  className = '',
  showLabels = true,
  showLegend = true,
  scrollable = false,
  style,
}: HeatmapBoardProps) {
  const { gameState, mode, startGame, boardWidth, boardHeight, score, showScore, showHeader } =
    useSnakeContext();
  const boardRef = useRef<HTMLDivElement>(null);

  useSnakeEngine(boardRef);

  const monthLabels = useMemo(() => {
    if (!showLabels || !data?.days) return [];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const results: { label: string; x: number }[] = [];
    const cellUnit = blockSize + blockMargin;
    let lastMonth = -1;

    for (let x = 0; x < boardWidth; x++) {
      const dayIndex = x * boardHeight;
      if (dayIndex < data.days.length) {
        const month = new Date(data.days[dayIndex].date).getMonth();
        if (month !== lastMonth) {
          results.push({ label: months[month], x: x * cellUnit });
          lastMonth = month;
        }
      }
    }
    return results;
  }, [showLabels, data, boardWidth, boardHeight, blockSize, blockMargin]);

  const grid = useMemo(() => {
    const columns = [];
    let dayIndex = 0;
    for (let x = 0; x < boardWidth; x++) {
      const cells = [];
      for (let y = 0; y < boardHeight; y++) {
        const level =
          data?.days && dayIndex < data.days.length ? (data.days[dayIndex]?.level ?? 0) : 0;
        dayIndex++;
        cells.push(
          <div
            key={`${x}-${y}`}
            data-x={x}
            data-y={y}
            className={`github-snake-cell level-${level}`}
          />
        );
      }
      columns.push(
        <div key={`col-${x}`} className="github-snake-col">
          {cells}
        </div>
      );
    }
    return columns;
  }, [boardWidth, boardHeight, data]);

  const baseClass = `github-snake-container ${gameState !== 'IDLE' ? 'is-playing' : ''} is-${gameState.toLowerCase().replace('_', '-')} ${scrollable ? 'is-scrollable' : ''} ${className}`;

  const dynamicStyle = useMemo(
    () => ({
      ...style,
      '--cell-size': `${blockSize}px`,
      '--cell-gap': `${blockMargin}px`,
      '--labels-height': showLabels ? '28px' : '0px',
    }),
    [style, blockSize, blockMargin, showLabels]
  );

  return (
    <div className={baseClass} style={dynamicStyle} data-theme={colorScheme}>
      {showHeader && data?.userName && (
        <div className="github-snake-header">
          <div className="header-user">
            <svg
              height="20"
              width="20"
              viewBox="0 0 16 16"
              fill="currentColor"
              role="img"
              aria-labelledby="github-logo-title"
            >
              <title id="github-logo-title">GitHub Logo</title>
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 01-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 010 8c0-4.42 3.58-8 8-8Z" />
            </svg>
            <span className="user-label">GitHub</span>
            <span className="user-separator">|</span>
            <span className="user-handle">@{data.userName}</span>
          </div>
        </div>
      )}

      <div className="github-snake-scroll-area">
        <div className="github-snake-board-wrapper">
          {showLabels && monthLabels.length > 0 && (
            <div className="github-snake-months">
              {monthLabels.map((ml) => (
                <div
                  key={`month-${ml.label}-${ml.x}`}
                  className="month-label"
                  style={{ left: ml.x }}
                >
                  {ml.label}
                </div>
              ))}
            </div>
          )}
          <div className="github-snake-grid-container" style={{ position: 'relative' }}>
            <div className="github-snake-grid" ref={boardRef}>
              {grid}
            </div>
            {!scrollable && (
              <Overlay
                type={gameState}
                labels={labels}
                score={score}
                mode={mode}
                startGame={startGame}
              />
            )}
          </div>
        </div>
        {scrollable && (
          <Overlay
            type={gameState}
            labels={labels}
            score={score}
            mode={mode}
            startGame={startGame}
          />
        )}
      </div>

      {showLegend && (
        <div className="github-snake-footer">
          <div className="legend">
            <span>Less</span>
            <div className="legend-cells">
              {[0, 1, 2, 3, 4].map((l) => (
                <div key={l} className={`github-snake-cell level-${l}`} />
              ))}
            </div>
            <span>More</span>
          </div>
          {data?.totalContributions !== undefined && (
            <div className="contribution-count">
              <strong>{data.totalContributions.toLocaleString()}</strong> contributions this year
            </div>
          )}
        </div>
      )}
      {gameState === 'PLAYING' && showScore && <div className="score-hud">Score: {score}</div>}
    </div>
  );
});

interface OverlayProps {
  type: string;
  labels?: GitHubSnakeLabels;
  score: number;
  mode: string;
  startGame: () => void;
}

const Overlay = ({ type, labels, score, mode, startGame }: OverlayProps) => {
  if (type === 'PLAYING') return null;
  const isGameOver = type === 'GAME_OVER';
  const isWon = type === 'WON';
  const isIdle = type === 'IDLE';

  return (
    <div
      className={`github-snake-overlay ${isGameOver ? 'is-game-over' : ''} ${isWon ? 'is-won' : ''}`}
    >
      <div className="overlay-content">
        {isIdle && (
          <>
            <button
              type="button"
              className="github-snake-btn"
              onClick={startGame}
              aria-label="Start snake game"
            >
              {labels?.start || 'Start Snake'}
            </button>
            <p className="overlay-hint">
              {mode === 'AUTOMODE' ? 'Automode enabled' : 'Use arrow keys to move'}
            </p>
          </>
        )}
        {(isGameOver || isWon) && (
          <>
            <h3 className={isWon ? 'game-won-text' : 'game-over-text'}>
              {isWon ? labels?.won || 'Board Cleared!' : labels?.gameOver || 'Game Over'}
            </h3>
            <p className="score-text">
              {labels?.score || 'Score'}: {score}
            </p>
            <button
              type="button"
              className="github-snake-btn"
              onClick={startGame}
              aria-label="Restart snake game"
            >
              {labels?.restart || 'Play Again'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
