/// <reference types="@testing-library/jest-dom" />
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GitHubSnake } from '../components/GitHubSnake';
import type { ContributionData } from '../types';

vi.mock('../hooks/useSound', () => ({
  useSound: () => ({
    initAudio: vi.fn(),
    playEatSound: vi.fn(),
    playGameOverSound: vi.fn(),
    playWinSound: vi.fn(),
  }),
}));

const mockData: ContributionData = {
  days: [
    { date: '2023-01-01', count: 1, level: 1 },
    { date: '2023-01-02', count: 5, level: 2 },
    { date: '2023-01-03', count: 0, level: 0 },
  ],
};

describe('GitHubSnake', () => {
  it('renders the start button', () => {
    render(<GitHubSnake data={mockData} />);
    expect(screen.getByText(/Start Snake/i)).toBeInTheDocument();
  });

  it('shows score HUD after starting the game', () => {
    render(<GitHubSnake data={mockData} />);
    fireEvent.click(screen.getByText(/Start Snake/i));
    expect(screen.getByText(/Score: 0/i)).toBeInTheDocument();
  });

  it('applies the dark theme via data attribute', () => {
    const { container } = render(<GitHubSnake theme="dark" />);
    const board = container.querySelector('.github-snake-container');
    expect(board).toHaveAttribute('data-theme', 'dark');
  });

  it('renders correct grid dimensions', () => {
    const { container } = render(<GitHubSnake data={mockData} boardWidth={2} boardHeight={2} />);
    const cells = container.querySelectorAll('.github-snake-cell');
    expect(cells.length).toBe(4);
  });
});
