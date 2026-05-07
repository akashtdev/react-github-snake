import type { ContributionData, Direction, Position } from '../types';
import { getAutoDirection, getNextPosition, resolvePosition } from './gameLogic';

export type RadiusOption = 'square' | 'sm-rounded' | 'md-rounded' | 'xl-rounded';

export interface ExportOptions {
  theme?: 'light' | 'dark';
  blockSize?: number;
  blockMargin?: number;
  cornerRadius?: number;
  radius?: RadiusOption;
  showScore?: boolean;
  grow?: boolean;
  walls?: boolean;
  userName?: string;
  totalContributions?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  showHeader?: boolean;
  columns?: number;
}

const COLORS_DARK = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
const COLORS_LIGHT = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
const SNAKE_HEAD_DARK = '#f0f6fc';
const SNAKE_BODY_DARK = '#8b949e';
const SNAKE_HEAD_LIGHT = '#1f2328';
const SNAKE_BODY_LIGHT = '#57606a';

function getColors(theme: 'light' | 'dark') {
  return theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;
}

function getSnakeColors(theme: 'light' | 'dark') {
  return {
    head: theme === 'dark' ? SNAKE_HEAD_DARK : SNAKE_HEAD_LIGHT,
    body: theme === 'dark' ? SNAKE_BODY_DARK : SNAKE_BODY_LIGHT,
  };
}

function getContainerRadius(radius?: RadiusOption, fallback = 0): number {
  if (!radius || radius === 'square') return fallback;
  const mapping: Record<RadiusOption, number> = {
    square: 0,
    'sm-rounded': 6,
    'md-rounded': 12,
    'xl-rounded': 24,
  };
  return mapping[radius];
}

function renderSVGHeader(padding: number, userName: string, textColor: string): string {
  let svg = `<g transform="translate(${padding}, ${padding})">`;
  svg += `<path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 01-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 010 8c0-4.42 3.58-8 8-8Z" transform="scale(1.2)" fill="${textColor}" />`;
  svg += `<text x="24" y="14" font-size="14" font-weight="700" fill="${textColor}">GitHub <tspan font-weight="400" opacity="0.3">|</tspan> <tspan font-weight="500" opacity="0.7">@${userName}</tspan></text>`;
  svg += '</g>';
  return svg;
}

function renderSVGMonths(
  visibleDays: ContributionData['days'],
  rows: number,
  cellUnit: number,
  padding: number,
  headerSpace: number,
  textColor: string
): string {
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
  let svg = '';
  let lastMonth = -1;
  for (let i = 0; i < visibleDays.length; i++) {
    if (i % rows === 0) {
      const month = new Date(visibleDays[i].date).getMonth();
      if (month !== lastMonth) {
        const x = (i / rows) * cellUnit + padding;
        svg += `<text x="${x}" y="${padding + headerSpace + 12}" font-size="10" fill="${textColor}" opacity="0.5">${months[month]}</text>`;
        lastMonth = month;
      }
    }
  }
  return svg;
}

function renderSVGLegend(
  height: number,
  padding: number,
  isNarrow: boolean,
  totalContributions: number | undefined,
  boardWidth: number,
  textColor: string,
  colors: string[]
): string {
  const footerY = height - padding - (isNarrow && totalContributions !== undefined ? 28 : 8);
  let svg = `<g transform="translate(${padding}, ${footerY})">`;
  svg += `<text x="0" y="8" font-size="11" fill="${textColor}" opacity="0.8">Less</text>`;
  for (let i = 0; i <= 4; i++) {
    svg += `<rect x="${32 + i * 13}" y="0" width="10" height="10" rx="0" fill="${colors[i]}" />`;
  }
  svg += `<text x="100" y="8" font-size="11" fill="${textColor}" opacity="0.8">More</text>`;
  if (totalContributions !== undefined) {
    const textY = isNarrow ? 28 : 8;
    svg += `<text x="${boardWidth}" y="${textY}" font-size="12" fill="${textColor}" text-anchor="end"><tspan font-weight="700">${totalContributions.toLocaleString()}</tspan> contributions this year</text>`;
  }
  svg += '</g>';
  return svg;
}

function getSVGDimensions(
  cols: number,
  rows: number,
  cellUnit: number,
  blockMargin: number,
  showHeader: boolean,
  userName: string | undefined,
  showLabels: boolean,
  showLegend: boolean,
  totalContributions: number | undefined,
  padding: number
) {
  const headerSpace = showHeader && userName ? 40 : 0;
  const monthsSpace = showLabels ? 28 : 0;
  const boardWidth = cols * cellUnit - blockMargin;
  const boardHeight = rows * cellUnit - blockMargin;
  const isNarrow = boardWidth < 280;
  const footerSpace = showLegend ? (isNarrow && totalContributions !== undefined ? 60 : 40) : 0;
  return {
    width: boardWidth + padding * 2,
    height: boardHeight + padding * 2 + headerSpace + monthsSpace + footerSpace,
    boardWidth,
    headerSpace,
    monthsSpace,
    topOffset: padding + headerSpace + monthsSpace,
    isNarrow,
  };
}

export function generateStaticSVG(data: ContributionData, options: ExportOptions = {}): string {
  const {
    theme = 'dark',
    blockSize = 10,
    blockMargin = 2,
    cornerRadius: rawCornerRadius = 0,
    radius,
    userName = data.userName,
    totalContributions = data.totalContributions,
    showLabels = true,
    showLegend = true,
    showHeader = true,
    columns: requestedCols,
  } = options;

  const containerRadius = getContainerRadius(radius, rawCornerRadius);
  const cellRadius = 0;

  const rows = 7;
  const cols = requestedCols
    ? Math.min(requestedCols, Math.ceil(data.days.length / rows))
    : Math.ceil(data.days.length / rows);
  const cellUnit = blockSize + blockMargin;
  const padding = 20;

  const dims = getSVGDimensions(
    cols,
    rows,
    cellUnit,
    blockMargin,
    showHeader,
    userName,
    showLabels,
    showLegend,
    totalContributions,
    padding
  );
  const colors = getColors(theme);
  const bg = theme === 'dark' ? '#0d1117' : '#ffffff';
  const borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const textColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${dims.width}" height="${dims.height}" viewBox="0 0 ${dims.width} ${dims.height}">`;
  svg +=
    '<style>text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }</style>';
  svg += `<rect width="${dims.width}" height="${dims.height}" fill="${bg}" rx="${containerRadius}" ry="${containerRadius}" />`;
  svg += `<rect x="0.5" y="0.5" width="${dims.width - 1}" height="${dims.height - 1}" fill="none" stroke="${borderColor}" rx="${containerRadius}" ry="${containerRadius}" />`;

  if (showHeader && userName) svg += renderSVGHeader(padding, userName, textColor);
  if (showLabels) {
    const visibleDays = data.days.slice(-(cols * rows));
    svg += renderSVGMonths(visibleDays, rows, cellUnit, padding, dims.headerSpace, textColor);
  }

  const visibleDays = data.days.slice(-(cols * rows));
  for (let i = 0; i < visibleDays.length; i++) {
    const x = Math.floor(i / rows) * cellUnit + padding;
    const y = (i % rows) * cellUnit + dims.topOffset;
    svg += `<rect x="${x}" y="${y}" width="${blockSize}" height="${blockSize}" rx="${cellRadius}" fill="${colors[visibleDays[i].level] || colors[0]}" />`;
  }

  if (showLegend) {
    svg += renderSVGLegend(
      dims.height,
      padding,
      dims.isNarrow,
      totalContributions,
      dims.boardWidth,
      textColor,
      colors
    );
  }

  svg += '</svg>';
  return svg;
}

export interface SnakeFrame {
  snake: Position[];
  grid: number[];
  score: number;
}

function findNearestTarget(
  grid: number[],
  snake: Position[],
  boardHeight: number
): Position | null {
  const blocked = new Set(snake.map((p) => `${p.x}-${p.y}`));
  const head = snake[0];
  let best: Position | null = null;
  let bestDist = Number.POSITIVE_INFINITY;

  for (let i = 0; i < grid.length; i++) {
    if (grid[i] > 0) {
      const x = Math.floor(i / boardHeight);
      const y = i % boardHeight;
      if (!blocked.has(`${x}-${y}`)) {
        const dist = Math.abs(x - head.x) + Math.abs(y - head.y);
        if (dist < bestDist) {
          bestDist = dist;
          best = { x, y };
        }
      }
    }
  }
  return best;
}

export function simulateGame(
  data: ContributionData,
  boardHeight: number,
  options: ExportOptions = {}
): SnakeFrame[] {
  const { walls = false, grow = true, columns: requestedCols } = options;
  const cols = requestedCols
    ? Math.min(requestedCols, Math.ceil(data.days.length / boardHeight))
    : Math.ceil(data.days.length / boardHeight);

  const grid = data.days.slice(-(cols * boardHeight)).map((d) => d.level);
  let snake: Position[] = [
    { x: 2, y: 3 },
    { x: 1, y: 3 },
    { x: 0, y: 3 },
  ];
  let dir: Direction = 'RIGHT';
  let score = 0;
  const frames: SnakeFrame[] = [];

  const maxFrames = 1200;
  for (let t = 0; t < maxFrames; t++) {
    const target = findNearestTarget(grid, snake, boardHeight);
    if (!target) break;

    dir = getAutoDirection(snake[0], target, dir, snake, walls, cols, boardHeight);
    const next = resolvePosition(getNextPosition(snake[0], dir), cols, boardHeight, walls);
    if (!next || snake.some((p) => p.x === next.x && p.y === next.y)) break;

    snake = [next, ...snake];
    const gridIndex = next.x * boardHeight + next.y;

    if (grid[gridIndex] > 0) {
      grid[gridIndex] = 0;
      score++;
      if (!grow) snake.pop();
    } else {
      snake.pop();
    }

    frames.push({
      snake: snake.map((p) => ({ ...p })),
      grid: [...grid],
      score,
    });
  }

  return frames;
}

function renderAnimatedScore(
  frames: SnakeFrame[],
  frameDur: number,
  width: number,
  padding: number,
  textColor: string
): string {
  let svg = '';
  const segments: { score: number; start: number; end: number }[] = [];
  let currentScore = -1;

  for (let i = 0; i < frames.length; i++) {
    if (frames[i].score !== currentScore) {
      if (segments.length > 0) segments[segments.length - 1].end = i - 1;
      segments.push({ score: frames[i].score, start: i, end: i });
      currentScore = frames[i].score;
    }
  }
  if (segments.length > 0) segments[segments.length - 1].end = frames.length - 1;

  for (const seg of segments) {
    const startS = seg.start * frameDur;
    const endS = (seg.end + 1) * frameDur;
    svg += `<text x="${width - padding}" y="${padding + 14}" font-size="12" font-weight="600" fill="${textColor}" text-anchor="end" opacity="0">`;
    svg += `Score: ${seg.score}`;
    svg += `<animate attributeName="opacity" from="0" to="1" begin="${startS}s" dur="0.001s" fill="freeze" />`;
    if (seg.end < frames.length - 1) {
      svg += `<animate attributeName="opacity" from="1" to="0" begin="${endS}s" dur="0.001s" fill="freeze" />`;
    }
    svg += '</text>';
  }
  return svg;
}

function getCellColorAtFrame(
  col: number,
  row: number,
  level: number,
  snakeSet: Set<string>,
  headKey: string,
  snakeColors: { head: string; body: string },
  colors: string[]
): string {
  const key = `${col}-${row}`;
  if (key === headKey) return snakeColors.head;
  if (snakeSet.has(key)) return snakeColors.body;
  return colors[level] || colors[0];
}

function mapFramesToColors(
  frames: SnakeFrame[],
  snakeColors: { head: string; body: string },
  colors: string[],
  rows: number
): Map<string, string[]> {
  const cellAnimations = new Map<string, string[]>();
  const totalCells = frames[0].grid.length;
  const cols = totalCells / rows;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      cellAnimations.set(`${c}-${r}`, []);
    }
  }

  for (const frame of frames) {
    const snakeSet = new Set(frame.snake.map((p) => `${p.x}-${p.y}`));
    const headKey = `${frame.snake[0].x}-${frame.snake[0].y}`;

    for (let i = 0; i < totalCells; i++) {
      const col = Math.floor(i / rows);
      const row = i % rows;
      const arr = cellAnimations.get(`${col}-${row}`);
      if (arr) {
        arr.push(
          getCellColorAtFrame(col, row, frame.grid[i], snakeSet, headKey, snakeColors, colors)
        );
      }
    }
  }
  return cellAnimations;
}

function renderSVGAnimations(
  frames: SnakeFrame[],
  snakeColors: { head: string; body: string },
  colors: string[],
  cellUnit: number,
  padding: number,
  topOffset: number,
  blockSize: number,
  cellRadius: number,
  totalDur: number
): string {
  let svg = '';
  const cellAnimations = mapFramesToColors(frames, snakeColors, colors, 7);

  for (const [key, colorFrames] of cellAnimations) {
    const [col, row] = key.split('-').map(Number);
    const x = col * cellUnit + padding;
    const y = row * cellUnit + topOffset;
    const firstColor = colorFrames[0];
    svg += `<rect x="${x}" y="${y}" width="${blockSize}" height="${blockSize}" rx="${cellRadius}" fill="${firstColor}">`;
    if (colorFrames.some((c) => c !== firstColor)) {
      svg += `<animate attributeName="fill" values="${colorFrames.join(';')}" dur="${totalDur}s" repeatCount="indefinite" />`;
    }
    svg += '</rect>';
  }
  return svg;
}

export function generateAnimatedSVG(
  data: ContributionData,
  frames: SnakeFrame[],
  options: ExportOptions = {}
): string {
  const {
    theme = 'dark',
    blockSize = 10,
    blockMargin = 2,
    cornerRadius: rawCornerRadius = 0,
    radius,
    showScore = false,
    userName = data.userName,
    totalContributions = data.totalContributions,
    showLabels = true,
    showLegend = true,
    showHeader = true,
    columns: requestedCols,
  } = options;

  const containerRadius = getContainerRadius(radius, rawCornerRadius);
  const cellRadius = 0;

  if (frames.length === 0) return generateStaticSVG(data, options);

  const rows = 7;
  const cols = requestedCols
    ? Math.min(requestedCols, Math.ceil(data.days.length / rows))
    : Math.ceil(data.days.length / rows);
  const cellUnit = blockSize + blockMargin;
  const padding = 20;

  const dims = getSVGDimensions(
    cols,
    rows,
    cellUnit,
    blockMargin,
    showHeader,
    userName,
    showLabels,
    showLegend,
    totalContributions,
    padding
  );
  const colors = getColors(theme);
  const snakeColors = getSnakeColors(theme);
  const bg = theme === 'dark' ? '#0d1117' : '#ffffff';
  const borderColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const textColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
  const frameDur = 0.08;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${dims.width}" height="${dims.height}" viewBox="0 0 ${dims.width} ${dims.height}">`;
  svg +=
    '<style>text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }</style>';
  svg += `<rect width="${dims.width}" height="${dims.height}" fill="${bg}" rx="${containerRadius}" ry="${containerRadius}" />`;
  svg += `<rect x="0.5" y="0.5" width="${dims.width - 1}" height="${dims.height - 1}" fill="none" stroke="${borderColor}" rx="${containerRadius}" ry="${containerRadius}" />`;

  if (showHeader && userName) svg += renderSVGHeader(padding, userName, textColor);
  if (showLabels) {
    const visibleOriginalDays = data.days.slice(-(cols * rows));
    svg += renderSVGMonths(
      visibleOriginalDays,
      rows,
      cellUnit,
      padding,
      dims.headerSpace,
      textColor
    );
  }

  svg += renderSVGAnimations(
    frames,
    snakeColors,
    colors,
    cellUnit,
    padding,
    dims.topOffset,
    blockSize,
    cellRadius,
    frames.length * frameDur
  );

  if (showScore) svg += renderAnimatedScore(frames, frameDur, dims.width, padding, textColor);
  if (showLegend)
    svg += renderSVGLegend(
      dims.height,
      padding,
      dims.isNarrow,
      totalContributions,
      dims.boardWidth,
      textColor,
      colors
    );

  svg += '</svg>';
  return svg;
}
