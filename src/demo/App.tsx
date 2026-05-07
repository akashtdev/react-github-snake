import { useCallback, useEffect, useState } from 'react';
import { SnakeProvider } from '../lib/context/SnakeContext';
import type { ContributionData } from '../lib/index';
import { Docs } from './Docs';
import { CopyButton, DemoFooter, SyntaxHighlighter } from './Shared';
import { ControlDashboard } from './Toolbar';
import './demo.css';

interface ApiDay {
  date: string;
  contributionCount: number;
  contributionLevel: string;
}

interface ApiResponse {
  contributions: ApiDay[][];
}

const mapLevel = (l: string): 0 | 1 | 2 | 3 | 4 => {
  const levels: Record<string, 0 | 1 | 2 | 3 | 4> = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  };
  return levels[l] ?? 0;
};

const CodeBlock = ({ code }: { code: string }) => (
  <div className="code-block">
    <pre>
      <SyntaxHighlighter code={code} />
    </pre>
    <CopyButton text={code} />
  </div>
);

function AppContent() {
  const [username, setUsername] = useState('akashtdev');
  const [data, setData] = useState<ContributionData | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [loading, setLoading] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [columns, setColumns] = useState<number>(53);
  const [showLabels, setShowLabels] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [scrollable, setScrollable] = useState(false);
  const [autoColumns, setAutoColumns] = useState(true);

  const enrichedData = data
    ? {
        ...data,
        userName: username,
        totalContributions: data.days.reduce((a, b) => a + b.count, 0),
      }
    : undefined;

  const fetchGraph = useCallback(async (user: string) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://github-contributions-api.deno.dev/${user}.json`);
      if (!res.ok) throw new Error(`Failed to fetch data for ${user}`);
      const json = (await res.json()) as ApiResponse;
      const days = json.contributions.flatMap((w) =>
        w.map((d) => ({
          date: d.date,
          count: d.contributionCount,
          level: mapLevel(d.contributionLevel),
        }))
      );
      setData({ days });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not fetch GitHub graph.';
      setData(undefined);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGraph(username);
  }, [fetchGraph, username]);

  useEffect(() => {
    document.body.classList.toggle('theme-dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="demo-page">
      {showDocs ? (
        <Docs
          onBack={() => {
            setShowDocs(false);
            window.scrollTo(0, 0);
          }}
        />
      ) : (
        <>
          <header className="demo-header">
            <div className="section-inner">
              <h1>GitHub Heatmap Snake</h1>
              <p>
                A technical React component for transforming contribution data into interactive
                games.
              </p>
            </div>
          </header>

          <main className="demo-console">
            <div className="section-inner">
              <ControlDashboard
                username={username}
                setUsername={setUsername}
                onFetch={() => fetchGraph(username)}
                theme={theme}
                setTheme={setTheme}
                loading={loading}
                columns={columns}
                setColumns={setColumns}
                showLabels={showLabels}
                setShowLabels={setShowLabels}
                showLegend={showLegend}
                setShowLegend={setShowLegend}
                scrollable={scrollable}
                setScrollable={setScrollable}
                autoColumns={autoColumns}
                setAutoColumns={setAutoColumns}
                error={error}
                data={enrichedData}
              />
            </div>
          </main>

          <footer className="demo-footer">
            <div className="setup-guide">
              <section className="full-width-divider">
                <div className="section-inner" style={{ background: 'transparent' }}>
                  <div className="setup-header">
                    <h2>Quick Setup</h2>
                    <p>Integrate the engine into your project</p>
                  </div>
                </div>
              </section>

              <div className="setup-steps">
                <section>
                  <div className="section-inner">
                    <div className="setup-step">
                      <div className="step-info">
                        <div className="step-number">1</div>
                        <h3>Install</h3>
                      </div>
                      <div className="step-content">
                        <CodeBlock code="npm install react-github-snake" />
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="section-inner">
                    <div className="setup-step">
                      <div className="step-info">
                        <div className="step-number">2</div>
                        <h3>Import</h3>
                      </div>
                      <div className="step-content">
                        <CodeBlock
                          code={`import { GitHubSnake } from 'react-github-snake';\nimport 'react-github-snake/style.css';`}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="section-inner">
                    <div className="setup-step">
                      <div className="step-info">
                        <div className="step-number">3</div>
                        <h3>Render</h3>
                      </div>
                      <div className="step-content">
                        <CodeBlock code={`<GitHubSnake theme="dark" initialMode="AUTOMODE" />`} />
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <section className="full-width-divider bottom">
                <div className="section-inner">
                  <div className="setup-links-grid">
                    <div className="setup-link-cell">
                      <button
                        type="button"
                        onClick={() => {
                          setShowDocs(true);
                          window.scrollTo(0, 0);
                        }}
                        className="setup-link"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <title>Documentation</title>
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                        Full Documentation
                      </button>
                    </div>
                    <div className="setup-link-cell">
                      <a
                        href="https://github.com/akashtdev/react-github-snake"
                        target="_blank"
                        rel="noreferrer"
                        className="setup-link"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <title>GitHub Repository</title>
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                        Star on GitHub
                      </a>
                    </div>
                    <div className="setup-link-cell">
                      <a
                        href="https://www.npmjs.com/package/react-github-snake"
                        target="_blank"
                        rel="noreferrer"
                        className="setup-link"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <title>NPM Package</title>
                          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                          <line x1="12" y1="22" x2="12" y2="15.5" />
                          <polyline points="22 8.5 12 15.5 2 8.5" />
                          <polyline points="2 15.5 12 8.5 22 15.5" />
                          <line x1="12" y1="2" x2="12" y2="8.5" />
                        </svg>
                        NPM Package
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </footer>
          <DemoFooter />
        </>
      )}
    </div>
  );
}

export function App() {
  return (
    <SnakeProvider initialMode="MANUAL" initialSpeed={80}>
      <AppContent />
    </SnakeProvider>
  );
}
