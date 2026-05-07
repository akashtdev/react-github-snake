import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { GameMode, GameState, SnakeContextType } from '../types';

export const SnakeContext = createContext<SnakeContextType | undefined>(undefined);

interface SnakeProviderProps {
  children: ReactNode;
  initialMode?: GameMode;
  initialSpeed?: number;
  initialWalls?: boolean;
  initialSound?: boolean;
  initialGrow?: boolean;
  initialShowScore?: boolean;
  initialShowHeader?: boolean;
  boardWidth?: number;
  boardHeight?: number;
}

export function SnakeProvider({
  children,
  initialMode = 'MANUAL',
  initialSpeed = 100,
  initialWalls = false,
  initialSound = true,
  initialGrow = false,
  initialShowScore = true,
  initialShowHeader = true,
  boardWidth: boardWidthProp = 53,
  boardHeight = 7,
}: SnakeProviderProps) {
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [mode, setMode] = useState<GameMode>(initialMode);
  const [speed, setSpeed] = useState<number>(initialSpeed);
  const [walls, setWalls] = useState<boolean>(initialWalls);
  const [sound, setSound] = useState<boolean>(initialSound);
  const [grow, setGrow] = useState<boolean>(initialGrow);
  const [showScore, setShowScore] = useState<boolean>(initialShowScore);
  const [showHeader, setShowHeader] = useState<boolean>(initialShowHeader);
  const [score, setScore] = useState<number>(0);
  const [boardWidth, setBoardWidth] = useState<number>(boardWidthProp);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    setSound(initialSound);
  }, [initialSound]);

  useEffect(() => {
    setSpeed(initialSpeed);
  }, [initialSpeed]);

  useEffect(() => {
    setWalls(initialWalls);
  }, [initialWalls]);

  useEffect(() => {
    setGrow(initialGrow);
  }, [initialGrow]);

  useEffect(() => {
    setShowScore(initialShowScore);
  }, [initialShowScore]);

  useEffect(() => {
    setShowHeader(initialShowHeader);
  }, [initialShowHeader]);

  useEffect(() => {
    setBoardWidth(boardWidthProp);
  }, [boardWidthProp]);

  const startGame = useCallback((): void => {
    setGameState('PLAYING');
    setScore(0);
  }, []);

  const stopGame = useCallback((): void => {
    setGameState('GAME_OVER');
  }, []);

  const winGame = useCallback((): void => {
    setGameState('WON');
  }, []);

  const value = useMemo<SnakeContextType>(
    () => ({
      gameState,
      mode,
      speed,
      walls,
      sound,
      grow,
      showScore,
      showHeader,
      score,
      boardWidth,
      boardHeight,
      startGame,
      stopGame,
      setMode,
      setSpeed,
      setWalls,
      setSound,
      setGrow,
      setShowScore,
      setShowHeader,
      winGame,
      updateScore: setScore,
      setBoardWidth,
    }),
    [
      gameState,
      mode,
      speed,
      walls,
      sound,
      grow,
      showScore,
      showHeader,
      score,
      boardWidth,
      boardHeight,
      startGame,
      stopGame,
      winGame,
    ]
  );

  return <SnakeContext.Provider value={value}>{children}</SnakeContext.Provider>;
}

export function useSnakeContext(): SnakeContextType {
  const context = useContext(SnakeContext);
  if (context === undefined) {
    throw new Error('useSnakeContext must be used within a SnakeProvider');
  }
  return context;
}
