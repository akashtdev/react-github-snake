/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
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

describe('GitHubSnake v1 Compatibility', () => {
  const legacyData: ContributionData = {
    days: [
      { date: '2023-01-01', count: 1, level: 1 },
      { date: '2023-01-02', count: 5, level: 2 },
    ],
  };

  it('renders correctly with legacy minimal data (no userName)', () => {
    const { container } = render(<GitHubSnake data={legacyData} />);
    expect(container.querySelector('.github-snake-header')).not.toBeInTheDocument();

    // Basic elements should still exist
    expect(screen.getByText(/Start Snake/i)).toBeInTheDocument();
    expect(container.querySelector('.github-snake-grid')).toBeInTheDocument();
  });

  it('honors v1 prop names and defaults', () => {
    const fullData: ContributionData = {
      days: Array.from({ length: 50 }, (_, i) => ({
        date: `2023-01-${i + 1}`,
        count: 1,
        level: 1,
      })),
    };

    const { container } = render(
      <GitHubSnake
        data={fullData}
        boardWidth={10}
        boardHeight={5}
        initialSpeed={50}
        initialMode="AUTOMODE"
        theme="dark"
      />
    );

    // Verify dimensions
    const cells = container.querySelectorAll('.github-snake-grid .github-snake-cell');
    expect(cells.length).toBe(50); // 10 * 5

    // Verify theme
    const board = container.querySelector('.github-snake-container');
    expect(board).toHaveAttribute('data-theme', 'dark');

    // Verify mode hint
    expect(screen.getByText(/Automode enabled/i)).toBeInTheDocument();
  });

  it('maintains responsive behavior from v1', () => {
    const { container } = render(<GitHubSnake responsive={true} />);
    const wrapper = container.querySelector('.github-snake-wrapper');
    expect(wrapper).toHaveStyle({ display: 'block', width: '100%' });
  });
});
