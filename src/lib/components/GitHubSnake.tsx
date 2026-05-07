import { memo, useContext, useEffect, useMemo } from 'react';
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
  initialShowHeader?: boolean;
  blockSize?: number;
  blockMargin?: number;
  labels?: GitHubSnakeLabels;
  className?: string;
  style?: React.CSSProperties;
  responsive?: boolean;
  columns?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  scrollable?: boolean;
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
  initialShowHeader = true,
  blockSize = 15,
  blockMargin = 4,
  labels,
  className,
  style,
  responsive = false,
  columns,
  showLabels = true,
  showLegend = true,
  scrollable = false,
}: GitHubSnakeProps) {
  const existingContext = useContext(SnakeContext);
  const [wrapperRef, availableWidth] = useWidth();
  const validatedBoardWidth = Math.max(1, Math.min(boardWidth, 53));
  const validatedBoardHeight = Math.max(1, Math.min(boardHeight, 20));
  const validatedSpeed = Math.max(10, initialSpeed);

  const measuredCols = useMemo(() => {
    if (!responsive || availableWidth <= 0) return null;
    const colUnit = blockSize + blockMargin;
    const fitCols = Math.max(1, Math.floor((availableWidth - 30 + blockMargin) / colUnit));
    return Math.min(fitCols, validatedBoardWidth);
  }, [responsive, availableWidth, blockSize, blockMargin, validatedBoardWidth]);

  const dataWeeks = data?.days
    ? Math.ceil(data.days.length / validatedBoardHeight)
    : validatedBoardWidth;

  const effectiveBoardWidth = columns
    ? Math.min(columns, dataWeeks)
    : responsive && !scrollable
      ? Math.min(measuredCols ?? 10, validatedBoardWidth, dataWeeks)
      : Math.min(validatedBoardWidth, dataWeeks);

  const slicedData = useMemo(() => {
    if (!data?.days || effectiveBoardWidth >= dataWeeks) return data;
    return {
      ...data,
      days: data.days.slice((dataWeeks - effectiveBoardWidth) * validatedBoardHeight),
    };
  }, [data, effectiveBoardWidth, dataWeeks, validatedBoardHeight]);

  useEffect(() => {
    if (existingContext) existingContext.setBoardWidth(effectiveBoardWidth);
  }, [existingContext, effectiveBoardWidth]);

  const content = (
    <HeatmapBoard
      data={slicedData}
      blockSize={blockSize}
      blockMargin={blockMargin}
      labels={labels}
      colorScheme={theme}
      className={className}
      showLabels={showLabels}
      showLegend={showLegend}
      scrollable={scrollable}
      style={style}
    />
  );

  const wrapperStyle = responsive ? RESPONSIVE_WRAPPER_STYLE : WRAPPER_STYLE;

  if (existingContext)
    return (
      <div className="github-snake-wrapper" style={wrapperStyle} ref={wrapperRef}>
        {content}
      </div>
    );

  return (
    <div className="github-snake-wrapper" style={wrapperStyle} ref={wrapperRef}>
      <SnakeProvider
        initialMode={initialMode}
        initialSpeed={validatedSpeed}
        initialWalls={initialWalls}
        initialSound={initialSound}
        initialGrow={initialGrow}
        initialShowScore={initialShowScore}
        initialShowHeader={initialShowHeader}
        boardWidth={effectiveBoardWidth}
        boardHeight={validatedBoardHeight}
      >
        {content}
      </SnakeProvider>
    </div>
  );
});
