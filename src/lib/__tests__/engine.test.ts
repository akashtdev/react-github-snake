import { describe, expect, it } from 'vitest';
import type { Position } from '../types';
import { getAutoDirection, getNextPosition, getTargetContribution } from '../utils/gameLogic';

describe('Game Logic Utilities', () => {
  describe('getNextPosition', () => {
    it('moves UP correctly', () => {
      const head: Position = { x: 10, y: 10 };
      expect(getNextPosition(head, 'UP')).toEqual({ x: 10, y: 9 });
    });

    it('moves DOWN correctly', () => {
      const head: Position = { x: 10, y: 10 };
      expect(getNextPosition(head, 'DOWN')).toEqual({ x: 10, y: 11 });
    });

    it('moves LEFT correctly', () => {
      const head: Position = { x: 10, y: 10 };
      expect(getNextPosition(head, 'LEFT')).toEqual({ x: 9, y: 10 });
    });

    it('moves RIGHT correctly', () => {
      const head: Position = { x: 10, y: 10 };
      expect(getNextPosition(head, 'RIGHT')).toEqual({ x: 11, y: 10 });
    });
  });

  describe('getAutoDirection (Automated Logic)', () => {
    const snake: Position[] = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
    ];
    const width = 53;
    const height = 7;

    it('moves towards target (Right)', () => {
      const head = { x: 5, y: 5 };
      const target = { x: 10, y: 5 };
      const dir = getAutoDirection(head, target, 'RIGHT', snake, false, width, height);
      expect(dir).toBe('RIGHT');
    });

    it('moves towards target (Up)', () => {
      const head = { x: 5, y: 5 };
      const target = { x: 5, y: 2 };
      const dir = getAutoDirection(head, target, 'RIGHT', snake, false, width, height);
      expect(dir).toBe('UP');
    });

    it('prevents 180 degree turns', () => {
      const head = { x: 5, y: 5 };
      const target = { x: 4, y: 5 };
      const dir = getAutoDirection(head, target, 'RIGHT', snake, false, width, height);
      expect(dir).not.toBe('LEFT');
    });

    it('avoids walls when walls are enabled', () => {
      const head = { x: 0, y: 0 };
      const target = { x: -1, y: 0 };
      const dir = getAutoDirection(head, target, 'RIGHT', [{ x: 0, y: 0 }], true, 10, 10);
      expect(dir).not.toBe('LEFT');
    });

    it('wraps correctly when walls are disabled', () => {
      const head = { x: 0, y: 5 };
      const target = { x: 52, y: 5 };
      const dir = getAutoDirection(head, target, 'LEFT', snake, false, 53, 7);
      expect(dir).toBe('LEFT');
    });
  });

  describe('getTargetContribution', () => {
    it('finds the closest contribution cell', () => {
      const div = document.createElement('div');
      div.innerHTML = `
        <div class="github-snake-cell level-0" data-x="0" data-y="0"></div>
        <div class="github-snake-cell level-1" data-x="5" data-y="5"></div>
        <div class="github-snake-cell level-2" data-x="10" data-y="10"></div>
      `;
      const cellsMap = new Map();
      const cells = div.querySelectorAll('.github-snake-cell');
      for (let i = 0; i < cells.length; i++) {
        const element = cells[i];
        if (!(element instanceof HTMLElement)) continue;
        const cell = element;
        const xStr = cell.getAttribute('data-x');
        const yStr = cell.getAttribute('data-y');
        if (xStr && yStr) {
          const x = Number.parseInt(xStr, 10);
          const y = Number.parseInt(yStr, 10);
          cellsMap.set(`${x}-${y}`, { cell, x, y });
        }
      }

      const snake: Position[] = [{ x: 4, y: 4 }];
      const target = getTargetContribution(cellsMap, snake, 53, 7, false);

      expect(target).toEqual({ x: 5, y: 5 });
    });

    it('returns null if no targets exist', () => {
      const div = document.createElement('div');
      div.innerHTML = `<div class="github-snake-cell level-0" data-x="0" data-y="0"></div>`;
      const cellsMap = new Map();
      const cells = div.querySelectorAll('.github-snake-cell');
      for (let i = 0; i < cells.length; i++) {
        const element = cells[i];
        if (!(element instanceof HTMLElement)) continue;
        const cell = element;
        const xStr = cell.getAttribute('data-x');
        const yStr = cell.getAttribute('data-y');
        if (xStr && yStr) {
          const x = Number.parseInt(xStr, 10);
          const y = Number.parseInt(yStr, 10);
          cellsMap.set(`${x}-${y}`, { cell, x, y });
        }
      }

      const snake: Position[] = [{ x: 0, y: 0 }];
      expect(getTargetContribution(cellsMap, snake, 53, 7, false)).toBeNull();
    });
  });
});
