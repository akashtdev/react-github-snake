import { memo, use, useEffect, useMemo, useState } from 'react';
import { SnakeContext, SnakeProvider } from '../context/SnakeContext';
import { useWidth } from '../hooks/useWidth';
import type { ContributionData, GameMode, GitHubSnakeLabels } from '../types';
import { HeatmapBoard } from './HeatmapBoard';
import '../style.css';

export interface GitHubSnakeProps {
  data?: ContributionData;
  boardWidth?: number;
  boardHeight?: number;
  theme?: 'light' | 'dark';
  initialMode?: GameMode;
  initialSpeed?: number;
  initialWalls?: boolean;
  initialSound?: boolean;
  initialGrow?: boolean;
  initialShowScore?: boolean;
  blockSize?: number;
  blockMargin?: number;
  labels?: GitHubSnakeLabels;
  className?: string;
  style?: React.CSSProperties;
  /**
   * When true, the component automatically adjusts the number of visible
   * columns to fit the available container width. Older columns (left side)
   * are trimmed first, keeping the most recent data visible.
   * @default false
   */
  responsive?: boolean;
}

const WRAPPER_STYLE: React.CSSProperties = { display: 'inline-block' };
const RESPONSIVE_WRAPPER_STYLE: React.CSSProperties = {
  display: 'block',
  width: '100%',
  overflow: 'hidden',
  textAlign: 'center',
};

export const GitHubSnake = memo(function GitHubSnake({
  data,
  boardWidth = 53,
  boardHeight = 7,
  theme,
  initialMode = 'MANUAL',
  initialSpeed = 100,
  initialWalls = false,
  initialSound = true,
  initialGrow = false,
  initialShowScore = true,
  blockSize = 15,
  blockMargin = 4,
  labels,
  className,
  style,
  responsive = false,
}: GitHubSnakeProps) {
  const existingContext = use(SnakeContext);
  const [wrapperRef, availableWidth] = useWidth();
  const [measuredCols, setMeasuredCols] = useState<number | null>(null);

  const validatedBoardWidth = Math.max(1, Math.min(boardWidth, 100));
  const validatedBoardHeight = Math.max(1, Math.min(boardHeight, 20));
  const validatedSpeed = Math.max(10, initialSpeed);

  useEffect(() => {
    if (!responsive || availableWidth <= 0) {
      setMeasuredCols(null);
      return;
    }
    const innerChrome = 30;
    const effectiveWidth = availableWidth - innerChrome;
    if (effectiveWidth <= 0) {
      setMeasuredCols(1);
      return;
    }
    const colUnit = blockSize + blockMargin;
    const fitCols = Math.max(1, Math.floor((effectiveWidth + blockMargin) / colUnit));
    setMeasuredCols(Math.min(fitCols, validatedBoardWidth));
  }, [responsive, availableWidth, blockSize, blockMargin, validatedBoardWidth]);

  const dataWeeks = data?.days
    ? Math.ceil(data.days.length / validatedBoardHeight)
    : validatedBoardWidth;

  const effectiveBoardWidth = responsive
    ? Math.min(measuredCols ?? Math.min(10, validatedBoardWidth), validatedBoardWidth, dataWeeks)
    : Math.min(validatedBoardWidth, dataWeeks);

  const slicedData = useMemo((): ContributionData | undefined => {
    if (!data?.days) return data;
    if (effectiveBoardWidth >= dataWeeks) return data;

    const weeksToSkip = dataWeeks - effectiveBoardWidth;
    const daysToSkip = weeksToSkip * validatedBoardHeight;
    return { days: data.days.slice(daysToSkip) };
  }, [data, effectiveBoardWidth, dataWeeks, validatedBoardHeight]);

  useEffect(() => {
    if (existingContext) {
      existingContext.setBoardWidth(effectiveBoardWidth);
    }
  }, [existingContext, effectiveBoardWidth]);

  const content = (
    <HeatmapBoard
      data={slicedData}
      blockSize={blockSize}
      blockMargin={blockMargin}
      labels={labels}
      colorScheme={theme}
      className={className}
      style={style}
    />
  );

  if (existingContext) {
    return (
      <div
        className="github-snake-wrapper"
        style={responsive ? RESPONSIVE_WRAPPER_STYLE : WRAPPER_STYLE}
        ref={wrapperRef}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className="github-snake-wrapper"
      style={responsive ? RESPONSIVE_WRAPPER_STYLE : WRAPPER_STYLE}
      ref={wrapperRef}
    >
      <SnakeProvider
        initialMode={initialMode}
        initialSpeed={validatedSpeed}
        initialWalls={initialWalls}
        initialSound={initialSound}
        initialGrow={initialGrow}
        initialShowScore={initialShowScore}
        boardWidth={effectiveBoardWidth}
        boardHeight={validatedBoardHeight}
      >
        {content}
      </SnakeProvider>
    </div>
  );
});
