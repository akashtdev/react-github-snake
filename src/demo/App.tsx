import { useCallback, useEffect, useState } from 'react';
import { type ContributionData, GitHubSnake, SnakeProvider } from '../lib/index';
import { Docs } from './Docs';
import { ControlsToolbar, IdentityToolbar } from './Toolbar';
import './demo.css';

interface ApiWeek {
  date: string;
  contributionCount: number;
  contributionLevel: string;
}

interface ApiResponse {
  contributions: ApiWeek[][];
}

function mapContributionLevel(level: string): 0 | 1 | 2 | 3 | 4 {
  switch (level) {
    case 'NONE':
      return 0;
    case 'FIRST_QUARTILE':
      return 1;
    case 'SECOND_QUARTILE':
      return 2;
    case 'THIRD_QUARTILE':
      return 3;
    default:
      return 4;
  }
}

function SyntaxHighlighter({ code }: { code: string }) {
  const parts = code.split(/(\s+|[{}(),;=<>/!]|['"].*?['"]|\d+)/);
  return (
    <code>
      {parts.map((part, i) => {
        if (/^(import|from|function|return|interface|const|export|type)$/.test(part)) {
          return (
            <span key={`${i}-${part}`} className="syntax-k">
              {part}
            </span>
          );
        }
        if (
          /^(GitHubSnake|SnakeProvider|ContributionData|GitHubSnakeLabels|App|GameControls|button|SnakeContext|string|number|boolean)$/.test(
            part
          )
        ) {
          return (
            <span key={`${i}-${part}`} className="syntax-t">
              {part}
            </span>
          );
        }
        if (
          /^(useSnakeContext|startGame|setMode|createRoot|render|getElementById|fetch|useWidth|useCallback|useEffect|useMemo|useState|use)$/.test(
            part
          )
        ) {
          return (
            <span key={`${i}-${part}`} className="syntax-f">
              {part}
            </span>
          );
        }
        if (/^['"].*?['"]$/.test(part)) {
          return (
            <span key={`${i}-${part}`} className="syntax-s">
              {part}
            </span>
          );
        }
        if (
          /^(theme|initialMode|initialSpeed|initialWalls|initialSound|initialGrow|blockSize|blockMargin|labels|data|responsive|initialShowScore|className|style|onClick|start|gameOver|won|restart|score|days|date|count|level)$/.test(
            part
          )
        ) {
          return (
            <span key={`${i}-${part}`} className="syntax-v">
              {part}
            </span>
          );
        }
        if (/^\d+$/.test(part)) {
          return (
            <span key={`${i}-${part}`} className="syntax-number">
              {part}
            </span>
          );
        }
        return part;
      })}
    </code>
  );
}

function CopyButton({
  text,
  index,
  copiedIndex,
  onCopy,
}: {
  text: string;
  index: number;
  copiedIndex: number | null;
  onCopy: (text: string, index: number) => void;
}) {
  const isCopied = copiedIndex === index;
  return (
    <button
      type="button"
      className="copy-btn"
      onClick={() => onCopy(text, index)}
      title={isCopied ? 'Copied!' : 'Copy to clipboard'}
      aria-label={isCopied ? 'Copied' : 'Copy code'}
    >
      {isCopied ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Copied"
        >
          <title>Copied</title>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Copy code"
        >
          <title>Copy code</title>
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

function AppContent() {
  const [username, setUsername] = useState('akashtdev');
  const [data, setData] = useState<ContributionData | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showDocs, setShowDocs] = useState(false);

  const handleCopy = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  const fetchGraph = useCallback(async (user: string) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://github-contributions-api.deno.dev/${user}.json`);
      if (res.ok) {
        const json = (await res.json()) as ApiResponse;
        if (!json.contributions || json.contributions.length === 0) {
          throw new Error('No contribution data found.');
        }
        const days = json.contributions.flatMap((week) =>
          week.map((day) => ({
            date: day.date,
            count: day.contributionCount,
            level: mapContributionLevel(day.contributionLevel),
          }))
        );
        setData({ days });
      } else {
        throw new Error(`Failed to fetch data for ${user}`);
      }
    } catch (e: unknown) {
      console.error(e);
      setData(undefined);
      setError(e instanceof Error ? e.message : 'Could not fetch GitHub graph.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFetch = useCallback(() => {
    fetchGraph(username);
  }, [username, fetchGraph]);

  useEffect(() => {
    fetchGraph(username);
  }, [fetchGraph, username]);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }
  }, [theme]);

  if (showDocs) {
    return (
      <Docs
        onBack={() => {
          setShowDocs(false);
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  return (
    <div className="demo-page">
      <header className="demo-header">
        <h1>GitHub Heatmap Snake</h1>
        <p>
          React component that transforms a GitHub contribution graph into a playable Snake game.
        </p>
      </header>

      <main className="demo-console">
        <IdentityToolbar
          username={username}
          setUsername={setUsername}
          onFetch={handleFetch}
          theme={theme}
          setTheme={setTheme}
          loading={loading}
        />

        <div className="demo-game-container">
          {error ? (
            <div className="demo-error-message">
              <p>{error}</p>
              <span className="demo-error-hint">Make sure the username is correct.</span>
            </div>
          ) : (
            <GitHubSnake data={data} theme={theme} blockSize={13} blockMargin={3} responsive />
          )}
        </div>

        <ControlsToolbar />
      </main>

      <footer className="demo-footer">
        <div className="setup-guide">
          <div className="setup-header">
            <h2>Quick Setup</h2>
            <p>Get started with GitHub Heatmap Snake in your React project</p>
          </div>

          <div className="setup-steps">
            <div className="setup-step">
              <div className="step-header">
                <div className="step-number">1</div>
                <h3>Install</h3>
              </div>
              <div className="code-block">
                <pre>
                  <SyntaxHighlighter code="npm install react-github-snake" />
                </pre>
                <CopyButton
                  text="npm install react-github-snake"
                  index={1}
                  copiedIndex={copiedIndex}
                  onCopy={handleCopy}
                />
              </div>
            </div>

            <div className="setup-step">
              <div className="step-header">
                <div className="step-number">2</div>
                <h3>Import and Use</h3>
              </div>
              <div className="code-block">
                <pre>
                  <SyntaxHighlighter
                    code={`import { GitHubSnake } from 'react-github-snake';
import 'react-github-snake/style.css';

function App() {
  return (
    <GitHubSnake
      theme="dark"
      initialMode="AUTOMODE"
      initialSpeed={80}
    />
  );
}`}
                  />
                </pre>
                <CopyButton
                  text={`import { GitHubSnake } from 'react-github-snake';
import 'react-github-snake/style.css';

function App() {
  return (
    <GitHubSnake
      theme="dark"
      initialMode="AUTOMODE"
      initialSpeed={80}
    />
  );
}`}
                  index={2}
                  copiedIndex={copiedIndex}
                  onCopy={handleCopy}
                />
              </div>
            </div>

            <div className="setup-step">
              <div className="step-header">
                <div className="step-number">3</div>
                <h3>Customize (Optional)</h3>
              </div>
              <div className="code-block">
                <pre>
                  <SyntaxHighlighter
                    code={`<GitHubSnake
  theme="light"
  initialMode="MANUAL"
  initialSpeed={100}
  initialWalls={false}
  initialSound={true}
  initialGrow={false}
  blockSize={15}
  blockMargin={4}
/>`}
                  />
                </pre>
                <CopyButton
                  text={`<GitHubSnake
  theme="light"
  initialMode="MANUAL"
  initialSpeed={100}
  initialWalls={false}
  initialSound={true}
  initialGrow={false}
  blockSize={15}
  blockMargin={4}
/>`}
                  index={3}
                  copiedIndex={copiedIndex}
                  onCopy={handleCopy}
                />
              </div>
            </div>
          </div>

          <div className="setup-links">
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
                viewBox="0 0 16 16"
                fill="none"
                role="img"
                aria-label="Documentation"
              >
                <title>Documentation</title>
                <path
                  d="M2 5.5C2 4.67157 2.67157 4 3.5 4H12.5C13.3284 4 14 4.67157 14 5.5V12.5C14 13.3284 13.3284 14 12.5 14H3.5C2.67157 14 2 13.3284 2 12.5V5.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path d="M5 7H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M5 9.5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path
                  d="M4 4V2.5C4 2.22386 4.22386 2 4.5 2H11.5C11.7761 2 12 2.22386 12 2.5V4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              Full Documentation
            </button>
            <a
              href="https://www.npmjs.com/package/react-github-snake"
              target="_blank"
              rel="noopener noreferrer"
              className="setup-link"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                role="img"
                aria-label="NPM"
              >
                <title>NPM Package</title>
                <path
                  d="M2.5 4.5H13.5V11.5H8V13H5.5V11.5H2.5V4.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.5 7V9.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path d="M8 7V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path
                  d="M10.5 7V9.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              NPM Package
            </a>
          </div>
        </div>

        <div className="footer-links">
          <a
            href="https://github.com/akashtdev/react-github-snake"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Star on GitHub
          </a>
          <span className="footer-dot" />
          <a
            href="https://twitter.com/akashtdev"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Follow on Twitter
          </a>
        </div>
        <p className="footer-copy">Built with ❤️ by akashtdev</p>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <SnakeProvider initialMode="MANUAL" initialSpeed={80} initialWalls={false}>
      <AppContent />
    </SnakeProvider>
  );
}
