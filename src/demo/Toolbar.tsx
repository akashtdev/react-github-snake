import { memo, useState } from 'react';
import { useSnakeContext } from '../lib/context/SnakeContext';
import { useGitHubSnakeExport } from '../lib/hooks/useGitHubSnakeExport';
import { GitHubSnake } from '../lib/index';
import type { ContributionData } from '../lib/types';
import type { RadiusOption } from '../lib/utils/exporter';

interface LayoutToolbarProps {
  username: string;
  setUsername: (u: string) => void;
  onFetch: () => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  loading: boolean;
  columns: number;
  setColumns: (c: number) => void;
  showLabels: boolean;
  setShowLabels: (s: boolean) => void;
  showLegend: boolean;
  setShowLegend: (s: boolean) => void;
  scrollable: boolean;
  setScrollable: (s: boolean) => void;
  autoColumns: boolean;
  setAutoColumns: (s: boolean) => void;
  error: string | null;
}

export const ControlDashboard = memo(function ControlDashboard({
  username,
  setUsername,
  onFetch,
  theme,
  setTheme,
  loading,
  columns,
  setColumns,
  showLabels,
  setShowLabels,
  showLegend,
  setShowLegend,
  scrollable,
  setScrollable,
  autoColumns,
  setAutoColumns,
  error,
  data,
}: LayoutToolbarProps & { data?: ContributionData }) {
  const {
    mode,
    setMode,
    speed,
    setSpeed,
    walls,
    setWalls,
    sound,
    setSound,
    grow,
    setGrow,
    showScore,
    setShowScore,
    showHeader,
    setShowHeader,
    gameState,
  } = useSnakeContext();

  const { exportSVG, exportAnimatedSVG } = useGitHubSnakeExport();
  const [exportCols, setExportCols] = useState(columns);
  const [useCustomExport, setUseCustomExport] = useState(false);
  const [exportRadius, setExportRadius] = useState<RadiusOption>('square');

  const isPlaying = gameState === 'PLAYING';

  const handleExportSVG = () => {
    if (data) {
      exportSVG(data, {
        theme,
        columns: useCustomExport ? exportCols : undefined,
        radius: exportRadius,
        showHeader,
        showLabels,
        showLegend,
      });
    }
  };

  const handleExportAnimatedSVG = () => {
    if (data) {
      exportAnimatedSVG(data, {
        theme,
        columns: useCustomExport ? exportCols : undefined,
        radius: exportRadius,
        grow,
        walls,
        showScore,
        showHeader,
        showLabels,
        showLegend,
      });
    }
  };

  return (
    <div className="studio-console">
      <div className="console-header">
        <div className="header-left header-branding">
          <div className="studio-badge">STUDIO</div>
          <a
            href="https://www.npmjs.com/package/react-github-snake"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <h2 className="console-title">
              Snake Engine <span>v1.1.0</span>
            </h2>
          </a>
        </div>

        <div className="header-center">
          <div className="input-with-action" style={{ height: '28px' }}>
            <input
              className="studio-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="GitHub Username..."
              style={{ padding: '0 10px', fontSize: '12px' }}
            />
            <button
              type="button"
              className="studio-action-btn"
              onClick={onFetch}
              disabled={loading}
              style={{ height: '100%', borderLeft: '1px solid var(--divider)' }}
            >
              {loading ? '...' : 'FETCH'}
            </button>
          </div>
        </div>

        <div className="header-right">
          <div className="theme-switcher">
            <button
              type="button"
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <title>Light Mode</title>
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </button>
            <button
              type="button"
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <title>Dark Mode</title>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="demo-game-container">
        {error ? (
          <div className="demo-error-message">
            <p>{error}</p>
            <span className="demo-error-hint">Make sure the username is correct.</span>
          </div>
        ) : (
          <GitHubSnake
            data={data}
            theme={theme}
            blockSize={13}
            blockMargin={3}
            responsive={autoColumns}
            columns={autoColumns ? undefined : columns}
            showLabels={showLabels}
            showLegend={showLegend}
            scrollable={scrollable}
          />
        )}
      </div>

      <div className="console-grid">
        <div className="control-pod">
          <div className="pod-label">VIEW</div>
          <div className="pod-row-grid">
            <div
              style={{
                gridColumn: 'span 3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span className="toggle-label">Custom Width</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <StudioToggle checked={!autoColumns} onChange={(v) => setAutoColumns(!v)} />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: !autoColumns ? 1 : 0.3,
                    pointerEvents: !autoColumns ? 'auto' : 'none',
                    borderLeft: '1px solid var(--divider)',
                    paddingLeft: '12px',
                    marginLeft: '4px',
                  }}
                >
                  <input
                    type="number"
                    min="1"
                    max="53"
                    className="studio-input small"
                    value={columns}
                    onChange={(e) => setColumns(Math.min(53, Math.max(1, Number(e.target.value))))}
                    disabled={autoColumns}
                  />
                  <span style={{ fontSize: '8px', fontWeight: '800', color: 'var(--muted-text)' }}>
                    COLS
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pod-row-grid">
            <StudioToggle label="Scrollable" checked={scrollable} onChange={setScrollable} />
            <div className="grid-v-divider" />
            <StudioToggle label="Labels" checked={showLabels} onChange={setShowLabels} />

            <StudioToggle label="Legend" checked={showLegend} onChange={setShowLegend} />
            <div className="grid-v-divider" />
            <StudioToggle label="Header" checked={showHeader} onChange={setShowHeader} />
          </div>
        </div>

        <div className="control-pod">
          <div className="pod-label">MECHANICS</div>
          <div className="pod-row-grid">
            <div className="studio-pill-group">
              <button
                type="button"
                className={`pill-opt ${mode === 'MANUAL' ? 'active' : ''}`}
                onClick={() => setMode('MANUAL')}
              >
                MANUAL
              </button>
              <button
                type="button"
                className={`pill-opt ${mode === 'AUTOMODE' ? 'active' : ''}`}
                onClick={() => setMode('AUTOMODE')}
              >
                AUTO
              </button>
            </div>
            <div className="grid-v-divider" />
            <div className="studio-slider-group">
              <span className="toggle-label">SPEED</span>
              <input
                type="range"
                min="20"
                max="300"
                value={320 - speed}
                onChange={(e) => setSpeed(320 - Number(e.target.value))}
                className="studio-range"
                style={{ marginLeft: 'auto' }}
              />
            </div>

            <StudioToggle label="Walls" checked={walls} onChange={setWalls} disabled={isPlaying} />
            <div className="grid-v-divider" />
            <StudioToggle label="Grow" checked={grow} onChange={setGrow} disabled={isPlaying} />

            <StudioToggle label="Audio" checked={sound} onChange={setSound} />
            <div className="grid-v-divider" />
            <StudioToggle label="Score" checked={showScore} onChange={setShowScore} />
          </div>
        </div>

        <div className="control-pod">
          <div className="pod-label">EXPORT ASSET</div>
          <div className="pod-row-grid">
            <div className="studio-slider-group" style={{ gridColumn: 'span 3' }}>
              <span className="toggle-label">CORNER</span>
              <div className="studio-pill-group">
                {(['square', 'sm-rounded', 'md-rounded', 'xl-rounded'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`pill-opt ${exportRadius === r ? 'active' : ''}`}
                    onClick={() => setExportRadius(r)}
                  >
                    {r.replace('-rounded', '').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                gridColumn: 'span 3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span className="toggle-label">Sync Width</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <StudioToggle checked={!useCustomExport} onChange={(v) => setUseCustomExport(!v)} />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: useCustomExport ? 1 : 0.3,
                    pointerEvents: useCustomExport ? 'auto' : 'none',
                    borderLeft: '1px solid var(--divider)',
                    paddingLeft: '12px',
                    marginLeft: '4px',
                  }}
                >
                  <input
                    type="number"
                    className="studio-input small"
                    value={exportCols}
                    onChange={(e) => setExportCols(Number(e.target.value))}
                    disabled={!useCustomExport}
                  />
                  <span style={{ fontSize: '8px', fontWeight: '800', color: 'var(--muted-text)' }}>
                    COLS
                  </span>
                </div>
              </div>
            </div>

            <div className="pod-row" style={{ gridColumn: 'span 3', width: '100%', gap: '12px' }}>
              <button
                type="button"
                className="studio-export-btn"
                onClick={handleExportSVG}
                disabled={!data}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ marginRight: '6px' }}
                >
                  <title>Export Static SVG</title>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                STATIC
              </button>
              <button
                type="button"
                className="studio-export-btn animated"
                onClick={handleExportAnimatedSVG}
                disabled={!data}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ marginRight: '6px' }}
                >
                  <title>Export Animated SVG</title>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                ANIMATED
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

function StudioToggle({
  label,
  checked,
  onChange,
  disabled,
}: { label?: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label
      className={`studio-toggle ${disabled ? 'disabled' : ''}`}
      style={{
        justifyContent: label ? 'space-between' : 'flex-end',
        width: label ? '100%' : 'auto',
      }}
    >
      {label && <span className="toggle-label">{label}</span>}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="toggle-box" />
    </label>
  );
}
