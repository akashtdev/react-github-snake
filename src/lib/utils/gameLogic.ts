import type { Direction, Position } from '../types';

export function getNextPosition(head: Position, dir: Direction): Position {
  switch (dir) {
    case 'UP':
      return { x: head.x, y: head.y - 1 };
    case 'DOWN':
      return { x: head.x, y: head.y + 1 };
    case 'LEFT':
      return { x: head.x - 1, y: head.y };
    case 'RIGHT':
      return { x: head.x + 1, y: head.y };
  }
}

export type CellData = { cell: HTMLElement; x: number; y: number };

export function getTargetContribution(
  cellsMap: Map<string, CellData>,
  head: Position
): Position | null {
  if (!cellsMap || cellsMap.size === 0 || !head) return null;

  let closest: Position | null = null;
  let minDistance = Number.POSITIVE_INFINITY;

  for (const { cell, x, y } of cellsMap.values()) {
    if (
      !cell.classList.contains('level-0') &&
      !cell.classList.contains('snake-body') &&
      !cell.classList.contains('snake-head')
    ) {
      const dist = Math.abs(x - head.x) + Math.abs(y - head.y);
      if (dist < minDistance) {
        minDistance = dist;
        closest = { x, y };
      }
    }
  }

  return closest;
}

function isOpposite(d1: Direction, d2: Direction): boolean {
  return (
    (d1 === 'UP' && d2 === 'DOWN') ||
    (d1 === 'DOWN' && d2 === 'UP') ||
    (d1 === 'LEFT' && d2 === 'RIGHT') ||
    (d1 === 'RIGHT' && d2 === 'LEFT')
  );
}

function wrapPosition(pos: Position, width: number, height: number): Position {
  return {
    x: pos.x < 0 ? width - 1 : pos.x >= width ? 0 : pos.x,
    y: pos.y < 0 ? height - 1 : pos.y >= height ? 0 : pos.y,
  };
}

export function getAutoDirection(
  head: Position,
  target: Position | null,
  currentDir: Direction,
  snake: Position[],
  walls: boolean,
  width: number,
  height: number
): Direction {
  if (!target || !head || !snake || width <= 0 || height <= 0) return currentDir;

  const possibleDirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  const scoredMoves: { dir: Direction; score: number }[] = [];

  for (const dir of possibleDirs) {
    if (isOpposite(dir, currentDir)) continue;

    let next = getNextPosition(head, dir);

    if (walls) {
      if (next.x < 0 || next.x >= width || next.y < 0 || next.y >= height) continue;
    } else {
      next = wrapPosition(next, width, height);
    }

    if (snake.some((s) => s.x === next.x && s.y === next.y)) continue;

    const dist = Math.abs(target.x - next.x) + Math.abs(target.y - next.y);
    scoredMoves.push({ dir, score: 1000 - dist });
  }

  if (scoredMoves.length === 0) return currentDir;

  scoredMoves.sort((a, b) => b.score - a.score);
  return scoredMoves[0].dir;
}
