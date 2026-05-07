import type { FC } from 'react';
import { useCallback, useState } from 'react';

export const SyntaxHighlighter: FC<{ code: string }> = ({ code }) => {
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
          /^(theme|initialMode|initialSpeed|initialWalls|initialSound|initialGrow|blockSize|blockMargin|labels|data|responsive|columns|showLabels|showLegend|scrollable|initialShowScore|className|style|onClick|start|gameOver|won|restart|score|days|date|count|level)$/.test(
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

export const CopyButton: FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      type="button"
      className="copy-btn"
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      aria-label={copied ? 'Copied' : 'Copy code'}
    >
      {copied ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          role="img"
          aria-labelledby="copied-title"
        >
          <title id="copied-title">Copied</title>
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
          role="img"
          aria-labelledby="copy-title"
        >
          <title id="copy-title">Copy</title>
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
};

export const DemoFooter = () => (
  <footer className="demo-footer">
    <section className="full-width-divider">
      <div className="section-inner" style={{ borderTop: 'none', background: 'var(--stripe-bg)' }}>
        <div className="footer-grid">
          <div className="footer-cell align-left">
            <a
              href="https://github.com/akashtdev/react-github-snake"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              GitHub
            </a>
          </div>
          <div className="footer-cell align-center">
            <span className="footer-copy">Built by akashtdev</span>
          </div>
          <div className="footer-cell align-right">
            <a
              href="https://twitter.com/akashtdev"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </section>
  </footer>
);
