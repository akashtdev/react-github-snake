# react-github-snake

[![NPM Version](https://img.shields.io/npm/v/react-github-snake)](https://www.npmjs.com/package/react-github-snake)
[![License](https://img.shields.io/npm/l/react-github-snake)](https://github.com/akashtdev/react-github-snake/blob/main/LICENSE)
[![Bundle Size](https://img.shields.io/badge/gzip-3.9KB%20JS%20%2B%201.3KB%20CSS-brightgreen)](https://github.com/akashtdev/react-github-snake)

An interactive GitHub contribution snake game for React.Transform any GitHub contribution heatmap into a playable snake game.

👉 **[Live Demo](https://akashtdev.github.io/react-github-snake/)**

## Features

- **Playable Heatmap**: Turn standard GitHub contribution data into an interactive game.
- **Automode**: Built-in pathfinding that clears the board for you.
- **Responsive**: Dynamically fit columns to container width.
- **Zero Dependencies**: Lightweight and fast.

## Installation

```bash
npm install react-github-snake
```

## Quick Start

```tsx
import { GitHubSnake } from 'react-github-snake';
import 'react-github-snake/style.css';

function App() {
  return (
    <GitHubSnake 
      theme="dark"
      initialMode="AUTOMODE"
      initialSpeed={80}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `data` | `ContributionData` | `undefined` | Manual contribution data object. If not provided, renders an empty board. |
| `theme` | `'light' \| 'dark'` | `'light'` | UI theme preset matching GitHub's aesthetics. |
| `boardWidth` | `number` | `53` | Number of columns in the game board (standard GitHub year view is 53 weeks). |
| `boardHeight` | `number` | `7` | Number of rows in the game board (7 days per week). |
| `initialMode` | `'MANUAL' \| 'AUTOMODE'` | `'MANUAL'` | Starting game mode. |
| `initialSpeed` | `number` | `100` | Delay (ms) between moves. |
| `initialWalls` | `boolean` | `false` | Enable wall-collision (game over on edge hit). |
| `initialSound` | `boolean` | `true` | Toggle spatial audio feedback. |
| `initialGrow` | `boolean` | `false` | Enable snake body growth when eating contributions. |
| `initialShowScore` | `boolean` | `true` | Show score HUD during gameplay. |
| `blockSize` | `number` | `15` | Cell size in pixels. |
| `blockMargin` | `number` | `4` | Gap between cells in pixels. |
| `responsive` | `boolean` | `false` | Dynamically fit columns to container width. |
| `labels` | `GitHubSnakeLabels` | `undefined` | Custom text labels for UI elements. |
| `className` | `string` | `''` | Additional CSS class for the container. |
| `style` | `React.CSSProperties` | `undefined` | Inline styles for the container. |

## Advanced Usage

For external control or multi-component synchronization, wrap your application in the `SnakeProvider` and use the `useSnakeContext` hook.

```tsx
import { SnakeProvider, GitHubSnake, useSnakeContext } from 'react-github-snake';

function CustomControls() {
  const { startGame, stopGame, gameState } = useSnakeContext();
  return (
    <button onClick={gameState === 'PLAYING' ? stopGame : startGame}>
      {gameState === 'PLAYING' ? 'Stop' : 'Start'}
    </button>
  );
}

function App() {
  return (
    <SnakeProvider initialSpeed={50}>
      <CustomControls />
      <GitHubSnake />
    </SnakeProvider>
  );
}
```


## Development

```bash
npm run dev          # Start local demo
npm run check        # Lint and format code
npm run test:run     # Run all tests
npm run build        # Build for production
```

## License

MIT © [akashtdev](https://github.com/akashtdev).