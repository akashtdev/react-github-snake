export type Position = { x: number; y: number };

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameState = 'IDLE' | 'PLAYING' | 'GAME_OVER' | 'WON';

export type GameMode = 'MANUAL' | 'AUTOMODE';

export interface SnakeContextState {
  gameState: GameState;
  mode: GameMode;
  speed: number;
  walls: boolean;
  sound: boolean;
  grow: boolean;
  showScore: boolean;
  showHeader: boolean;
  score: number;
  boardWidth: number;
  boardHeight: number;
}

export interface SnakeContextActions {
  startGame: () => void;
  stopGame: () => void;
  winGame: () => void;
  setMode: (mode: GameMode) => void;
  setSpeed: (speed: number) => void;
  setWalls: (walls: boolean) => void;
  setSound: (on: boolean) => void;
  setGrow: (grow: boolean) => void;
  setShowScore: (show: boolean) => void;
  setShowHeader: (show: boolean) => void;
  updateScore: (score: number) => void;
  setBoardWidth: (width: number) => void;
}

export interface GitHubSnakeLabels {
  start?: string;
  gameOver?: string;
  won?: string;
  restart?: string;
  score?: string;
}

export interface SnakeContextType extends SnakeContextState, SnakeContextActions {}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionData {
  days: ContributionDay[];
  userName?: string;
  totalContributions?: number;
}
