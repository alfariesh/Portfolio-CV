import { Cursor } from "./Cursor";

const swatches = [
  { name: "ink", value: "#181818" },
  { name: "paper", value: "#FCFCF9" },
  { name: "line", value: "#D7D7D6" },
  { name: "accent", value: "#81ACEC" },
];

const scale: [string, number, string][] = [
  ["Title", 28, "56 / 56 · −2%"],
  ["Body copy", 18, "18 / 28"],
  ["LABEL", 13, "14 / 28 · caps"],
];

// Each line is a list of [className, text] tokens for light syntax colouring.
const code: [string, string][][] = [
  [["c", "/* tokens.css · synced from the canvas */"]],
  [
    ["s", ":root"],
    ["p", " {"],
  ],
  [
    ["k", "  --ink"],
    ["p", ":    "],
    ["v", "#181818"],
    ["p", ";"],
  ],
  [
    ["k", "  --paper"],
    ["p", ":  "],
    ["v", "#FCFCF9"],
    ["p", ";"],
  ],
  [
    ["k", "  --line"],
    ["p", ":   "],
    ["v", "#D7D7D6"],
    ["p", ";"],
  ],
  [
    ["k", "  --accent"],
    ["p", ": "],
    ["v", "#81ACEC"],
    ["p", ";"],
  ],
  [["p", "}"]],
  [["p", ""]],
  [
    ["s", ".btn--ink"],
    ["p", " {"],
  ],
  [
    ["k", "  background"],
    ["p", ": "],
    ["v", "var(--ink)"],
    ["p", ";"],
  ],
  [
    ["k", "  color"],
    ["p", ": "],
    ["v", "var(--paper)"],
    ["p", ";"],
  ],
  [
    ["k", "  border-radius"],
    ["p", ": "],
    ["v", "4px"],
    ["p", ";"],
  ],
  [["p", "}"]],
];

export function LoopArt() {
  return (
    <div className="art art--loop">
      <div className="loop-canvas">
        <span className="art__label">Paper · Tokens</span>
        <div className="loop-board">
          <div className="loop-type">
            <span className="loop-type__aa">Aa</span>
            <span>
              display · 56 px
              <br />
              tracking −2%
            </span>
          </div>
          <div className="loop-swatches">
            {swatches.map((s) => (
              <span key={s.name} className="loop-swatch">
                <i style={{ background: s.value }} />
                <b>{s.name}</b>
                <code>{s.value}</code>
              </span>
            ))}
          </div>
          <div className="loop-scale">
            {scale.map(([name, size, spec]) => (
              <span key={name}>
                <b style={{ fontSize: size }}>{name}</b>
                <code>{spec}</code>
              </span>
            ))}
          </div>
          <div className="loop-components">
            <span className="btn btn--ink">say hello</span>
            <span className="link">read more →</span>
          </div>
        </div>
      </div>

      <div className="loop-code">
        <div className="loop-code__tabs">
          <span className="is-active">tokens.css</span>
          <span>Hero.tsx</span>
          <span>vite.config.ts</span>
        </div>
        <pre>
          {code.map((line, i) => (
            <span key={i} className="loop-code__line">
              <i>{i + 1}</i>
              {line.map(([cls, text], j) => (
                <span key={j} className={`tk-${cls}`}>
                  {text}
                </span>
              ))}
            </span>
          ))}
        </pre>
      </div>

      <span className="loop-pill loop-pill--to">get_jsx →</span>
      <span className="loop-pill loop-pill--back">← sync tokens</span>

      <Cursor name="Paper MCP" tone="mcp" x={470} y={560} />
    </div>
  );
}
