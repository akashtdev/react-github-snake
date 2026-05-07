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

function parseCellCoordinates(htmlEl: HTMLElement): { x: number; y: number } | null {
  const x = Number.parseInt(htmlEl.getAttribute('data-x') || '', 10);
  const y = Number.parseInt(htmlEl.getAttribute('data-y') || '', 10);
  if (Number.isNaN(x) || Number.isNaN(y)) return null;
  return { x, y };
}

export function useSnakeEngine(boardRef: React.RefObject<HTMLDivElement | null>) {
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

  useEffect(() => {
    cellsMapRef.current.clear();
    savedGridStateRef.current.clear();
  }, []);

  const ensureCellsCache = useCallback(() => {
    const mapSize = cellsMapRef.current.size;
    const firstCell = mapSize > 0 ? cellsMapRef.current.values().next().value?.cell : null;
    const isDetached = mapSize > 0 && (!firstCell || !document.contains(firstCell));
    const needsRebuild = mapSize === 0 || mapSize !== boardWidth * boardHeight || isDetached;

    if (!needsRebuild) return;

    cellsMapRef.current.clear();
    if (!boardRef.current) return;

    const cells = boardRef.current.querySelectorAll('.github-snake-cell');
    for (const el of cells) {
      const htmlEl = el as HTMLElement;
      const coords = parseCellCoordinates(htmlEl);
      if (coords) cellsMapRef.current.set(`${coords.x}-${coords.y}`, { cell: htmlEl, ...coords });
    }
  }, [boardRef, boardWidth, boardHeight]);

  const clearSnakeDOM = useCallback(() => {
    ensureCellsCache();
    for (const { cell } of cellsMapRef.current.values()) {
      if (cell) cell.classList.remove('snake-body', 'snake-head');
    }
  }, [ensureCellsCache]);

  const drawState = useCallback(() => {
    ensureCellsCache();
    clearSnakeDOM();
    snakeRef.current.forEach((segment, i) => {
      const cellData = cellsMapRef.current.get(`${segment.x}-${segment.y}`);
      if (cellData?.cell) {
        cellData.cell.classList.add(i === 0 ? 'snake-head' : 'snake-body');
      }
    });
  }, [clearSnakeDOM, ensureCellsCache]);

  const restoreGrid = useCallback(() => {
    ensureCellsCache();
    cellsMapRef.current.forEach(({ cell }, key) => {
      const saved = savedGridStateRef.current.get(key);
      if (saved && cell) cell.className = `github-snake-cell ${saved}`;
    });
  }, [ensureCellsCache]);

  const saveGrid = useCallback(() => {
    ensureCellsCache();
    savedGridStateRef.current.clear();
    cellsMapRef.current.forEach(({ cell }, key) => {
      if (cell) {
        const level = Array.from(cell.classList).find((c) => c.startsWith('level-'));
        if (level) savedGridStateRef.current.set(key, level);
      }
    });
  }, [ensureCellsCache]);

  const checkWin = useCallback(() => {
    if (mode === 'AUTOMODE')
      return !getTargetContribution(
        cellsMapRef.current,
        snakeRef.current,
        boardWidth,
        boardHeight,
        walls
      );
    return !Array.from(cellsMapRef.current.values()).some(
      ({ cell }) =>
        cell &&
        !cell.classList.contains('level-0') &&
        !cell.classList.contains('snake-body') &&
        !cell.classList.contains('snake-head')
    );
  }, [mode, walls, boardWidth, boardHeight]);

  const handleGameOver = useCallback(() => {
    if (sound) playGameOverSound();
    stopGame();
  }, [sound, playGameOverSound, stopGame]);

  const handleEating = useCallback(
    (next: Position) => {
      const cellData = cellsMapRef.current.get(`${next.x}-${next.y}`);
      const isEat =
        cellData?.cell &&
        !cellData.cell.classList.contains('level-0') &&
        !cellData.cell.classList.contains('snake-body');

      if (isEat && cellData?.cell) {
        cellData.cell.classList.remove('level-1', 'level-2', 'level-3', 'level-4');
        cellData.cell.classList.add('level-0');
        if (sound) playEatSound();
        scoreRef.current += 10;
        updateScore(scoreRef.current);
      }
      return !!isEat;
    },
    [sound, playEatSound, updateScore]
  );

  const calculateNext = useCallback(
    (head: Position): Position | null => {
      let next = getNextPosition(head, dirRef.current);
      if (walls) {
        if (next.x < 0 || next.x >= boardWidth || next.y < 0 || next.y >= boardHeight) {
          handleGameOver();
          return null;
        }
      } else {
        next = { x: (next.x + boardWidth) % boardWidth, y: (next.y + boardHeight) % boardHeight };
      }

      if (snakeRef.current.some((s) => s.x === next.x && s.y === next.y)) {
        handleGameOver();
        return null;
      }
      return next;
    },
    [walls, boardWidth, boardHeight, handleGameOver]
  );

  const updateDirForAutomode = useCallback(
    (head: Position) => {
      if (mode !== 'AUTOMODE') return;
      const target = getTargetContribution(
        cellsMapRef.current,
        snakeRef.current,
        boardWidth,
        boardHeight,
        walls
      );
      if (target) {
        dirRef.current = getAutoDirection(
          head,
          target,
          dirRef.current,
          snakeRef.current,
          walls,
          boardWidth,
          boardHeight
        );
      }
    },
    [mode, boardWidth, boardHeight, walls]
  );

  const processMovement = useCallback(() => {
    const head = { ...snakeRef.current[0] };
    updateDirForAutomode(head);
    const next = calculateNext(head);
    if (!next) return;

    const isEat = handleEating(next);
    const newSnake = [next, ...snakeRef.current];
    if (!isEat || !grow) newSnake.pop();
    snakeRef.current = newSnake;
    drawState();
  }, [grow, drawState, calculateNext, handleEating, updateDirForAutomode]);

  const tick = useCallback(
    (time: number) => {
      if (gameState !== 'PLAYING') return;
      if (time - lastTickRef.current > speed) {
        lastTickRef.current = time;
        ensureCellsCache();
        if (checkWin()) {
          if (sound) playWinSound();
          winGame();
          return;
        }
        processMovement();
      }
      reqRef.current = requestAnimationFrame(tick);
    },
    [gameState, speed, sound, winGame, playWinSound, checkWin, ensureCellsCache, processMovement]
  );

  useEffect(() => {
    if (mode === 'AUTOMODE' || gameState !== 'PLAYING') return;
    const onKey = (e: KeyboardEvent) => {
      const dir = KEYS_MAP[e.key];
      if (dir && dir !== OPPOSITES[dirRef.current]) {
        e.preventDefault();
        dirRef.current = dir;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, gameState]);

  useEffect(() => {
    if (gameState !== 'PLAYING') {
      if (gameState !== 'WON') clearSnakeDOM();
      return;
    }
    lastTickRef.current = performance.now();
    reqRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(reqRef.current);
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
