import { CopyButton, DemoFooter, SyntaxHighlighter } from './Shared';

const CodeBlock = ({ code }: { code: string }) => (
  <div className="code-block">
    <pre>
      <SyntaxHighlighter code={code} />
    </pre>
    <CopyButton text={code} />
  </div>
);

export const Docs = ({ onBack }: { onBack: () => void }) => {
  return (
    <>
      <nav className="docs-nav full-width-divider">
        <div className="section-inner">
          <button type="button" onClick={onBack} className="back-btn">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <title>Back</title>
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1>Full Documentation</h1>
        </div>
      </nav>

      <div className="docs-content">
        <section className="full-width-divider">
          <div className="section-inner background">
            <h2>Overview</h2>
            <p>
              <code>react-github-snake</code> transforms GitHub contribution data into an
              interactive snake game. It is designed to be lightweight, responsive, and highly
              customizable.
            </p>
          </div>
        </section>

        <section className="full-width-divider">
          <div className="section-inner docs-content-bottom background">
            <h2>Installation</h2>
          </div>
        </section>

        <section>
          <div className="section-inner ">
            <CodeBlock code="npm install react-github-snake" />
          </div>
        </section>

        <section className="full-width-divider">
          <div className="section-inner background">
            <h2>Component API</h2>
          </div>
        </section>

        <section>
          <div className="section-inner">
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
                      <code className="syntax-v">data</code>
                    </td>
                    <td>
                      <code className="syntax-t">ContributionData</code>
                    </td>
                    <td>
                      <code>undefined</code>
                    </td>
                    <td>Contribution dataset to render.</td>
                  </tr>
                  <tr>
                    <td>
                      <code className="syntax-v">theme</code>
                    </td>
                    <td>
                      <code>'light' | 'dark'</code>
                    </td>
                    <td>
                      <code>'light'</code>
                    </td>
                    <td>Visual color preset.</td>
                  </tr>
                  <tr>
                    <td>
                      <code className="syntax-v">responsive</code>
                    </td>
                    <td>
                      <code>boolean</code>
                    </td>
                    <td>
                      <code>false</code>
                    </td>
                    <td>Auto-fit columns to container width.</td>
                  </tr>
                  <tr>
                    <td>
                      <code className="syntax-v">columns</code>
                    </td>
                    <td>
                      <code>number</code>
                    </td>
                    <td>
                      <code>53</code>
                    </td>
                    <td>Force a specific number of columns.</td>
                  </tr>
                  <tr>
                    <td>
                      <code className="syntax-v">showLabels</code>
                    </td>
                    <td>
                      <code>boolean</code>
                    </td>
                    <td>
                      <code>true</code>
                    </td>
                    <td>Show month labels above the grid.</td>
                  </tr>
                  <tr>
                    <td>
                      <code className="syntax-v">showLegend</code>
                    </td>
                    <td>
                      <code>boolean</code>
                    </td>
                    <td>
                      <code>true</code>
                    </td>
                    <td>Show the legend and contribution count.</td>
                  </tr>
                  <tr>
                    <td>
                      <code className="syntax-v">scrollable</code>
                    </td>
                    <td>
                      <code>boolean</code>
                    </td>
                    <td>
                      <code>false</code>
                    </td>
                    <td>Enable horizontal scrolling for overflow.</td>
                  </tr>
                  <tr>
                    <td>
                      <code className="syntax-v">initialMode</code>
                    </td>
                    <td>
                      <code>'MANUAL' | 'AUTOMODE'</code>
                    </td>
                    <td>
                      <code>'MANUAL'</code>
                    </td>
                    <td>Starting game control scheme.</td>
                  </tr>
                  <tr>
                    <td>
                      <code className="syntax-v">initialSpeed</code>
                    </td>
                    <td>
                      <code>number</code>
                    </td>
                    <td>
                      <code>100</code>
                    </td>
                    <td>Snake movement speed (ms delay).</td>
                  </tr>
                  <tr>
                    <td>
                      <code className="syntax-v">initialWalls</code>
                    </td>
                    <td>
                      <code>boolean</code>
                    </td>
                    <td>
                      <code>false</code>
                    </td>
                    <td>Enable collision with board edges.</td>
                  </tr>
                  <tr>
                    <td>
                      <code className="syntax-v">initialSound</code>
                    </td>
                    <td>
                      <code>boolean</code>
                    </td>
                    <td>
                      <code>true</code>
                    </td>
                    <td>Enable game sound effects.</td>
                  </tr>
                  <tr>
                    <td>
                      <code className="syntax-v">initialGrow</code>
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
                      <code className="syntax-v">initialScore</code>
                    </td>
                    <td>
                      <code>boolean</code>
                    </td>
                    <td>
                      <code>true</code>
                    </td>
                    <td>Show score overlay.</td>
                  </tr>
                  <tr>
                    <td>
                      <code className="syntax-v">cellSize</code>
                    </td>
                    <td>
                      <code>number</code>
                    </td>
                    <td>
                      <code>12</code>
                    </td>
                    <td>Size of each grid cell in pixels.</td>
                  </tr>
                  <tr>
                    <td>
                      <code className="syntax-v">cellRadius</code>
                    </td>
                    <td>
                      <code>number</code>
                    </td>
                    <td>
                      <code>2</code>
                    </td>
                    <td>Border radius of grid cells.</td>
                  </tr>
                  <tr>
                    <td>
                      <code className="syntax-v">cellGap</code>
                    </td>
                    <td>
                      <code>number</code>
                    </td>
                    <td>
                      <code>4</code>
                    </td>
                    <td>Pixel gap between grid cells.</td>
                  </tr>
                  <tr>
                    <td>
                      <code className="syntax-v">className</code>
                    </td>
                    <td>
                      <code>string</code>
                    </td>
                    <td>
                      <code>''</code>
                    </td>
                    <td>Additional CSS class for the container.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section>
          <div className="section-inner background">
            <h3>Export Options</h3>
            <p>
              The <code>useGitHubSnakeExport</code> hook accepts an <code>options</code> object:
            </p>
          </div>
        </section>

        <section>
          <div className="section-inner">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Option</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code className="syntax-v">radius</code>
                    </td>
                    <td>
                      <code>'square' | 'sm-rounded' | 'md-rounded' | 'xl-rounded'</code>
                    </td>
                    <td>Corner radius preset for grid cells.</td>
                  </tr>
                  <tr>
                    <td>
                      <code className="syntax-v">showHeader</code>
                    </td>
                    <td>
                      <code>boolean</code>
                    </td>
                    <td>Include the GitHub identity header in the export.</td>
                  </tr>
                  <tr>
                    <td>
                      <code className="syntax-v">showLabels</code>
                    </td>
                    <td>
                      <code>boolean</code>
                    </td>
                    <td>Include month labels.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="full-width-divider">
          <div className="section-inner background">
            <h2>Advanced Usage</h2>
            <h3>Provider Pattern</h3>
            <p>
              Use <code>SnakeProvider</code> for external control or synchronizing multiple
              components.
            </p>
          </div>
        </section>

        <section>
          <div className="section-inner">
            <CodeBlock
              code={`import { SnakeProvider, GitHubSnake, useSnakeContext } from 'react-github-snake';\n\nfunction GameControls() {\n  const { startGame } = useSnakeContext();\n  return <button onClick={startGame}>Start</button>;\n}\n\nfunction App() {\n  return (\n    <SnakeProvider>\n      <GameControls />\n      <GitHubSnake />\n    </SnakeProvider>\n  );\n}`}
            />
          </div>
        </section>

        <section className="full-width-divider">
          <div className="section-inner background">
            <h2>Data Schema</h2>
          </div>
        </section>

        <section>
          <div className="section-inner">
            <CodeBlock
              code={
                'interface ContributionData {\n  days: {\n    date: string;\n    count: number;\n    level: 0 | 1 | 2 | 3 | 4;\n  }[];\n  userName?: string;\n  totalContributions?: number;\n}'
              }
            />
          </div>
        </section>
      </div>
      <DemoFooter />
    </>
  );
};
