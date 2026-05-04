import { type FC, useState } from 'react';

interface DocsProps {
  onBack: () => void;
}

const SyntaxHighlighter: FC<{ code: string }> = ({ code }) => {
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
};

const CodeBlock: FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block">
      <button type="button" className="copy-btn" onClick={handleCopy} aria-label="Copy code">
        {copied ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Copied</title>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Copy</title>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
      <pre>
        <SyntaxHighlighter code={code} />
      </pre>
    </div>
  );
};

export const Docs: FC<DocsProps> = ({ onBack }) => {
  return (
    <div className="docs-container">
      <nav className="docs-nav">
        <button type="button" onClick={onBack} className="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" role="img" aria-label="Back">
            <title>Back</title>
            <path
              d="M15 19l-7-7 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="back-text">Back to Demo</span>
        </button>
        <h1>Full Documentation</h1>
      </nav>

      <div className="docs-content">
        <section>
          <h2>Overview</h2>
          <p>
            <code>react-github-snake</code> is a highly customizable React component that transforms
            standard GitHub contribution data into an interactive, playable snake game. It features
            built-in pathfinding, spatial audio, and theme support.
          </p>
        </section>

        <section>
          <h2>Installation</h2>
          <CodeBlock code="npm install react-github-snake" />
        </section>

        <section>
          <h2>Component API</h2>
          <h3>GitHubSnake Props</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>data</code>
                  </td>
                  <td>
                    <code>ContributionData</code>
                  </td>
                  <td>
                    <code>undefined</code>
                  </td>
                  <td>The dataset to render on the board.</td>
                </tr>
                <tr>
                  <td>
                    <code>theme</code>
                  </td>
                  <td>
                    <code>'light' | 'dark'</code>
                  </td>
                  <td>
                    <code>'light'</code>
                  </td>
                  <td>Visual preset for colors and effects.</td>
                </tr>
                <tr>
                  <td>
                    <code>boardWidth</code>
                  </td>
                  <td>
                    <code>number</code>
                  </td>
                  <td>
                    <code>53</code>
                  </td>
                  <td>Columns in the grid (weeks).</td>
                </tr>
                <tr>
                  <td>
                    <code>boardHeight</code>
                  </td>
                  <td>
                    <code>number</code>
                  </td>
                  <td>
                    <code>7</code>
                  </td>
                  <td>Rows in the grid (days).</td>
                </tr>
                <tr>
                  <td>
                    <code>initialMode</code>
                  </td>
                  <td>
                    <code>'MANUAL' | 'AUTOMODE'</code>
                  </td>
                  <td>
                    <code>'MANUAL'</code>
                  </td>
                  <td>Starting control scheme.</td>
                </tr>
                <tr>
                  <td>
                    <code>initialSpeed</code>
                  </td>
                  <td>
                    <code>number</code>
                  </td>
                  <td>
                    <code>100</code>
                  </td>
                  <td>Move delay in milliseconds.</td>
                </tr>
                <tr>
                  <td>
                    <code>initialWalls</code>
                  </td>
                  <td>
                    <code>boolean</code>
                  </td>
                  <td>
                    <code>false</code>
                  </td>
                  <td>Enable edge-hit game over.</td>
                </tr>
                <tr>
                  <td>
                    <code>initialSound</code>
                  </td>
                  <td>
                    <code>boolean</code>
                  </td>
                  <td>
                    <code>true</code>
                  </td>
                  <td>Enable audio feedback triggers.</td>
                </tr>
                <tr>
                  <td>
                    <code>initialGrow</code>
                  </td>
                  <td>
                    <code>boolean</code>
                  </td>
                  <td>
                    <code>false</code>
                  </td>
                  <td>Snake grows when eating contributions.</td>
                </tr>
                <tr>
                  <td>
                    <code>blockSize</code>
                  </td>
                  <td>
                    <code>number</code>
                  </td>
                  <td>
                    <code>15</code>
                  </td>
                  <td>Size of individual cells.</td>
                </tr>
                <tr>
                  <td>
                    <code>blockMargin</code>
                  </td>
                  <td>
                    <code>number</code>
                  </td>
                  <td>
                    <code>4</code>
                  </td>
                  <td>Gap between cells.</td>
                </tr>
                <tr>
                  <td>
                    <code>responsive</code>
                  </td>
                  <td>
                    <code>boolean</code>
                  </td>
                  <td>
                    <code>false</code>
                  </td>
                  <td>Dynamically fit columns to container width.</td>
                </tr>
                <tr>
                  <td>
                    <code>initialShowScore</code>
                  </td>
                  <td>
                    <code>boolean</code>
                  </td>
                  <td>
                    <code>true</code>
                  </td>
                  <td>Show score HUD during gameplay.</td>
                </tr>
                <tr>
                  <td>
                    <code>labels</code>
                  </td>
                  <td>
                    <code>GitHubSnakeLabels</code>
                  </td>
                  <td>
                    <code>undefined</code>
                  </td>
                  <td>Custom text labels for UI elements.</td>
                </tr>
                <tr>
                  <td>
                    <code>className</code>
                  </td>
                  <td>
                    <code>string</code>
                  </td>
                  <td>
                    <code>''</code>
                  </td>
                  <td>Additional CSS class for the container.</td>
                </tr>
                <tr>
                  <td>
                    <code>style</code>
                  </td>
                  <td>
                    <code>React.CSSProperties</code>
                  </td>
                  <td>
                    <code>undefined</code>
                  </td>
                  <td>Inline styles for the container element.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>Custom Labels</h2>
          <p>You can customize all UI text by passing a labels object.</p>
          <CodeBlock
            code={`<GitHubSnake
  labels={{
    start: 'Begin Game',
    gameOver: 'You Lost!',
    won: 'Victory!',
    restart: 'Try Again',
    score: 'Points'
  }}
/>`}
          />
        </section>

        <section>
          <h2>Advanced Usage</h2>
          <h3>Using the Provider</h3>
          <p>
            For external control or multi-component synchronization, wrap your app in the
            <code>SnakeProvider</code> and use the <code>useSnakeContext</code> hook.
          </p>
          <CodeBlock
            code={`import { SnakeProvider, GitHubSnake, useSnakeContext } from 'react-github-snake';

function GameControls() {
  const { startGame, setMode } = useSnakeContext();
  return <button onClick={startGame}>Go!</button>;
}

function App() {
  return (
    <SnakeProvider>
      <GameControls />
      <GitHubSnake />
    </SnakeProvider>
  );
}`}
          />
        </section>

        <section>
          <h2>Types</h2>
          <CodeBlock
            code={`interface ContributionData {
  days: {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
  }[];
}`}
          />
        </section>
      </div>
    </div>
  );
};
