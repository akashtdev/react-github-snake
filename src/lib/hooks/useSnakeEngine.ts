import { useCallback, useEffect, useRef } from 'react';
import { useSnakeContext } from '../context/SnakeContext';
import type { Direction, Position } from '../types';
import {
  type CellData,
  getAutoDirection,
  getNextPosition,
  getTargetContribution,
} from '../utils/gameLogic';
import { useSound } from './useSound';

const INITIAL_SNAKE: Position[] = [
  { x: 5, y: 3 },
  { x: 4, y: 3 },
  { x: 3, y: 3 },
];
const INITIAL_DIRECTION: Direction = 'RIGHT';

const KEYS_MAP: Record<string, Direction> = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
};

const OPPOSITES: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

function isCollision(head: Position, snake: Position[]): boolean {
  return snake.some((segment) => segment.x === head.x && segment.y === head.y);
}

function isOutOfBounds(head: Position, width: number, height: number): boolean {
  return head.x < 0 || head.x >= width || head.y < 0 || head.y >= height;
}

export function useSnakeEngine(boardRef: React.RefObject<HTMLDivElement | null>): {
  snakeRef: React.MutableRefObject<Position[]>;
} {
  const {
    gameState,
    mode,
    speed,
    walls,
    sound,
    grow,
    boardWidth,
    boardHeight,
    stopGame,
    winGame,
    updateScore,
  } = useSnakeContext();
  const { initAudio, playEatSound, playGameOverSound, playWinSound } = useSound();

  const snakeRef = useRef<Position[]>([...INITIAL_SNAKE]);
  const dirRef = useRef<Direction>(INITIAL_DIRECTION);
  const scoreRef = useRef(0);
  const lastTickRef = useRef(0);
  const reqRef = useRef<number>(0);
  const savedGridStateRef = useRef<Map<string, string>>(new Map());
  const cellsMapRef = useRef<Map<string, CellData>>(new Map());

  const ensureCellsCache = useCallback((): void => {
    if (cellsMapRef.current.size > 0 || !boardRef.current) return;
    const cells = Array.from(
      boardRef.current.querySelectorAll('.github-snake-cell')
    ) as HTMLElement[];
    for (const el of cells) {
      const x = Number.parseInt(el.getAttribute('data-x') || '', 10);
      const y = Number.parseInt(el.getAttribute('data-y') || '', 10);
      if (!Number.isNaN(x) && !Number.isNaN(y)) {
        cellsMapRef.current.set(`${x}-${y}`, { cell: el, x, y });
      }
    }
  }, [boardRef]);

  const clearSnakeDOM = useCallback((): void => {
    ensureCellsCache();
    for (const { cell } of cellsMapRef.current.values()) {
      cell.classList.remove('snake-body', 'snake-head');
    }
  }, [ensureCellsCache]);

  const drawState = useCallback((): void => {
    ensureCellsCache();
    clearSnakeDOM();
    snakeRef.current.forEach((segment, index) => {
      const cellData = cellsMapRef.current.get(`${segment.x}-${segment.y}`);
      if (cellData) {
        cellData.cell.classList.add(index === 0 ? 'snake-head' : 'snake-body');
      }
    });
  }, [clearSnakeDOM, ensureCellsCache]);

  const restoreGrid = useCallback((): void => {
    ensureCellsCache();
    for (const [key, { cell }] of cellsMapRef.current.entries()) {
      const savedClass = savedGridStateRef.current.get(key);
      if (savedClass) cell.className = `github-snake-cell ${savedClass}`;
    }
  }, [ensureCellsCache]);

  const saveGrid = useCallback((): void => {
    ensureCellsCache();
    savedGridStateRef.current.clear();
    for (const [key, { cell }] of cellsMapRef.current.entries()) {
      const level = Array.from(cell.classList).find((c) => c.startsWith('level-'));
      if (level) savedGridStateRef.current.set(key, level);
    }
  }, [ensureCellsCache]);

  const checkWinCondition = useCallback((): boolean => {
    if (mode === 'AUTOMODE') {
      return !getTargetContribution(cellsMapRef.current, snakeRef.current[0]);
    }
    return !Array.from(cellsMapRef.current.values()).some(
      ({ cell }) =>
        !cell.classList.contains('level-0') &&
        !cell.classList.contains('snake-body') &&
        !cell.classList.contains('snake-head')
    );
  }, [mode]);

  const handleGameOver = useCallback((): void => {
    if (sound) playGameOverSound();
    stopGame();
  }, [sound, playGameOverSound, stopGame]);

  const handleWin = useCallback((): void => {
    if (sound) playWinSound();
    winGame();
  }, [sound, playWinSound, winGame]);

  const getTargetDir = useCallback(
    (head: Position): Direction => {
      const target = getTargetContribution(cellsMapRef.current, head);
      if (!target) return dirRef.current;
      return getAutoDirection(
        head,
        target,
        dirRef.current,
        snakeRef.current,
        walls,
        boardWidth,
        boardHeight
      );
    },
    [walls, boardWidth, boardHeight]
  );

  const getWrappedPosition = useCallback(
    (next: Position): Position => {
      return {
        x: next.x < 0 ? boardWidth - 1 : next.x >= boardWidth ? 0 : next.x,
        y: next.y < 0 ? boardHeight - 1 : next.y >= boardHeight ? 0 : next.y,
      };
    },
    [boardWidth, boardHeight]
  );

  const moveSnake = useCallback((): Position | null => {
    const head = { ...snakeRef.current[0] };
    if (mode === 'AUTOMODE') dirRef.current = getTargetDir(head);

    let next = getNextPosition(head, dirRef.current);
    if (walls) {
      if (isOutOfBounds(next, boardWidth, boardHeight)) return null;
    } else {
      next = getWrappedPosition(next);
    }
    return isCollision(next, snakeRef.current) ? null : next;
  }, [mode, walls, boardWidth, boardHeight, getTargetDir, getWrappedPosition]);

  const processCell = useCallback(
    (pos: Position): boolean => {
      const data = cellsMapRef.current.get(`${pos.x}-${pos.y}`);
      if (!data) return false;
      const { cell } = data;
      const isTarget =
        !cell.classList.contains('level-0') &&
        !cell.classList.contains('snake-body') &&
        !cell.classList.contains('snake-head');

      if (!isTarget) return false;

      cell.classList.remove('level-1', 'level-2', 'level-3', 'level-4');
      cell.classList.add('level-0');
      if (sound) playEatSound();
      scoreRef.current += 10;
      updateScore(scoreRef.current);
      return true;
    },
    [sound, playEatSound, updateScore]
  );

  const tick = useCallback(
    (time: number): void => {
      if (gameState !== 'PLAYING') return;

      if (time - lastTickRef.current > speed) {
        lastTickRef.current = time;
        ensureCellsCache();
        if (checkWinCondition()) {
          handleWin();
          return;
        }

        const nextHead = moveSnake();
        if (!nextHead) {
          handleGameOver();
          return;
        }

        const snake = [nextHead, ...snakeRef.current];
        if (!processCell(nextHead) || !grow) snake.pop();

        snakeRef.current = snake;
        drawState();
      }
      reqRef.current = requestAnimationFrame(tick);
    },
    [
      gameState,
      speed,
      grow,
      drawState,
      handleGameOver,
      handleWin,
      ensureCellsCache,
      checkWinCondition,
      moveSnake,
      processCell,
    ]
  );

  useEffect(() => {
    if (mode === 'AUTOMODE' || gameState !== 'PLAYING') return;
    const onKeyDown = (e: KeyboardEvent): void => {
      const dir = KEYS_MAP[e.key];
      if (dir && dir !== OPPOSITES[dirRef.current]) {
        e.preventDefault();
        dirRef.current = dir;
      }
    };
    window.addEventListener('keydown', onKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, gameState]);

  useEffect(() => {
    if (gameState !== 'PLAYING') {
      if (gameState === 'IDLE' || gameState === 'GAME_OVER') clearSnakeDOM();
      return;
    }
    lastTickRef.current = performance.now();
    reqRef.current = requestAnimationFrame(tick);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [gameState, tick, clearSnakeDOM]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      initAudio();
      snakeRef.current = [...INITIAL_SNAKE];
      dirRef.current = INITIAL_DIRECTION;
      scoreRef.current = 0;
      updateScore(0);
      restoreGrid();
      saveGrid();
      drawState();
    }
  }, [gameState, initAudio, drawState, saveGrid, restoreGrid, updateScore]);

  return { snakeRef };
}
