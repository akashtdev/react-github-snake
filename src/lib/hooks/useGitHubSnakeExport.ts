import { useCallback } from 'react';
import { useSnakeContext } from '../context/SnakeContext';
import type { ContributionData } from '../types';
import {
  type ExportOptions,
  generateAnimatedSVG,
  generateStaticSVG,
  simulateGame,
} from '../utils/exporter';

function downloadBlob(svg: string, filename: string) {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function useGitHubSnakeExport() {
  const { boardHeight } = useSnakeContext();

  const exportSVG = useCallback((data: ContributionData, options: ExportOptions = {}) => {
    const svg = generateStaticSVG(data, options);
    downloadBlob(svg, `github-snake-${Date.now()}.svg`);
    return svg;
  }, []);

  const exportAnimatedSVG = useCallback(
    (data: ContributionData, options: ExportOptions = {}) => {
      const frames = simulateGame(data, boardHeight, options);
      const svg = generateAnimatedSVG(data, frames, options);
      downloadBlob(svg, `github-snake-animated-${Date.now()}.svg`);
      return svg;
    },
    [boardHeight]
  );

  return { exportSVG, exportAnimatedSVG };
}
