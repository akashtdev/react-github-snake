import type { Direction, Position } from '../types';

export type CellData = { cell?: HTMLElement; x: number; y: number; level?: number };

const ALL_DIRS: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
const OPPOSITES: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

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

export function resolvePosition(
  pos: Position,
  w: number,
  h: number,
  walls: boolean
): Position | null {
  if (walls) {
    if (pos.x < 0 || pos.x >= w || pos.y < 0 || pos.y >= h) return null;
    return pos;
  }
  return {
    x: ((pos.x % w) + w) % w,
    y: ((pos.y % h) + h) % h,
  };
}

function floodFillSize(
  start: Position,
  blocked: Set<string>,
  w: number,
  h: number,
  walls: boolean
): number {
  const visited = new Set<string>();
  const queue: Position[] = [start];
  const startKey = `${start.x}-${start.y}`;
  if (blocked.has(startKey)) return 0;
  visited.add(startKey);

  while (queue.length > 0) {
    const cur = queue.shift();
    if (!cur) break;
    for (const dir of ALL_DIRS) {
      const raw = getNextPosition(cur, dir);
      const resolved = resolvePosition(raw, w, h, walls);
      if (!resolved) continue;
      const key = `${resolved.x}-${resolved.y}`;
      if (visited.has(key) || blocked.has(key)) continue;
      visited.add(key);
      queue.push(resolved);
    }
  }
  return visited.size;
}

function exploreNeighbors(
  pos: Position,
  dist: number,
  targetKey: string,
  visited: Set<string>,
  blocked: Set<string>,
  w: number,
  h: number,
  walls: boolean,
  queue: { pos: Position; dist: number }[]
): number | null {
  for (const dir of ALL_DIRS) {
    const next = resolvePosition(getNextPosition(pos, dir), w, h, walls);
    if (!next) continue;
    const key = `${next.x}-${next.y}`;
    if (key === targetKey) return dist + 1;
    if (!visited.has(key) && !blocked.has(key)) {
      visited.add(key);
      queue.push({ pos: next, dist: dist + 1 });
    }
  }
  return null;
}

function bfsDistance(
  start: Position,
  target: Position,
  blocked: Set<string>,
  w: number,
  h: number,
  walls: boolean
): number {
  const targetKey = `${target.x}-${target.y}`;
  if (`${start.x}-${start.y}` === targetKey) return 0;

  const visited = new Set<string>();
  const queue: { pos: Position; dist: number }[] = [{ pos: start, dist: 0 }];
  visited.add(`${start.x}-${start.y}`);

  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) break;
    const res = exploreNeighbors(
      item.pos,
      item.dist,
      targetKey,
      visited,
      blocked,
      w,
      h,
      walls,
      queue
    );
    if (res !== null) return res;
  }
  return Number.POSITIVE_INFINITY;
}

export function getTargetContribution(
  cellsMap: Map<string, CellData>,
  snake: Position[],
  w: number,
  h: number,
  walls: boolean
): Position | null {
  const blocked = new Set(snake.map((p) => `${p.x}-${p.y}`));
  const head = snake[0];
  let best: Position | null = null;
  let bestDist = Number.POSITIVE_INFINITY;

  for (const cell of cellsMap.values()) {
    const cellEl = cell.cell;
    const isTarget = cellEl
      ? !cellEl.classList.contains('level-0') &&
        !cellEl.classList.contains('snake-body') &&
        !cellEl.classList.contains('snake-head')
      : (cell.level ?? 0) > 0;

    if (isTarget && !blocked.has(`${cell.x}-${cell.y}`)) {
      const dist = bfsDistance(head, { x: cell.x, y: cell.y }, blocked, w, h, walls);
      if (dist < bestDist) {
        bestDist = dist;
        best = { x: cell.x, y: cell.y };
      }
      if (bestDist === 1) break;
    }
  }
  return best;
}

interface Candidate {
  dir: Direction;
  pos: Position;
  dist: number;
  space: number;
}

export function getAutoDirection(
  head: Position,
  target: Position,
  currentDir: Direction,
  snake: Position[],
  walls: boolean,
  w: number,
  h: number
): Direction {
  const blocked = new Set(snake.map((p) => `${p.x}-${p.y}`));
  const candidates: Candidate[] = [];

  for (const dir of ALL_DIRS) {
    if (dir === OPPOSITES[currentDir] && snake.length > 1) continue;
    const raw = getNextPosition(head, dir);
    const resolved = resolvePosition(raw, w, h, walls);
    if (resolved && !blocked.has(`${resolved.x}-${resolved.y}`)) {
      candidates.push({
        dir,
        pos: resolved,
        dist: Math.abs(target.x - resolved.x) + Math.abs(target.y - resolved.y),
        space: floodFillSize(resolved, blocked, w, h, walls),
      });
    }
  }

  if (candidates.length === 0) {
    for (const dir of ALL_DIRS) {
      const raw = getNextPosition(head, dir);
      const resolved = resolvePosition(raw, w, h, walls);
      if (resolved && !blocked.has(`${resolved.x}-${resolved.y}`)) return dir;
    }
    return currentDir;
  }

  const minSpace = Math.min(snake.length, w * h * 0.3);
  const safe = candidates.filter((c) => c.space >= minSpace);
  const pool = safe.length > 0 ? safe : candidates;

  return pool.sort((a, b) => a.dist - b.dist)[0].dir;
}
