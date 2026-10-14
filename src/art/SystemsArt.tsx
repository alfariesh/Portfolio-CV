import { Cursor } from "./Cursor";
import { pictogramNames } from "./pictogram-data";
import { Pictogram } from "./pictograms";

const states = [
  { label: "Draft", tone: "draft" },
  { label: "In review", tone: "review" },
  { label: "Approved", tone: "ok" },
  { label: "Rejected", tone: "no" },
  { label: "Archived", tone: "archived" },
];

export function SystemsArt() {
  return (
    <div className="art art--systems">
      <div className="sys-set">
        <span className="art__label">Rekanesia / Pictograms — 24 px grid · 1.5 stroke</span>
        <div className="sys-grid">
          {pictogramNames.map((name, i) => (
            <span key={name} className={i === 5 ? "is-selected" : undefined}>
              <Pictogram name={name} size={36} />
            </span>
          ))}
        </div>
      </div>

      <div className="sys-zoom">
        <span className="art__label">chart · keylines</span>
        <div className="sys-zoom__tile">
          <svg className="sys-zoom__keylines" viewBox="0 0 24 24" aria-hidden="true">
            {Array.from({ length: 23 }, (_, i) => (
              <g key={i}>
                <line x1={i + 1} y1="0" x2={i + 1} y2="24" />
                <line x1="0" y1={i + 1} x2="24" y2={i + 1} />
              </g>
            ))}
            <circle cx="12" cy="12" r="10" className="sys-zoom__key" />
            <rect x="3" y="3" width="18" height="18" className="sys-zoom__key" />
            <rect x="2" y="2" width="20" height="20" className="sys-zoom__safe" />
          </svg>
          <span className="sys-zoom__icon">
            <Pictogram name="chart" size={320} strokeWidth={1.5} />
          </span>
        </div>
      </div>

      <div className="sys-states">
        <span className="art__label">Rekanesia / States</span>
        <div className="sys-states__row">
          {states.map((s) => (
            <span key={s.tone} className="sys-state">
              <span className={`chip chip--lg chip--${s.tone}`}>
                <i />
                {s.label}
              </span>
              <code>--state-{s.tone}</code>
            </span>
          ))}
        </div>
      </div>

      <Cursor name="Claude" tone="agent" x={560} y={420} />
    </div>
  );
}
