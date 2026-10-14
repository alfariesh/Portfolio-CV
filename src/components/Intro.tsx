import { intro, tools } from "../content";
import { Mark } from "./Mark";

const icons = [
  [
    { letter: "V", tone: "ink" },
    { letter: "S", tone: "plum" },
  ],
  [
    { letter: "I", tone: "yolk" },
    { letter: "R", tone: "moss" },
  ],
];

export function Intro() {
  return (
    <div className="intro">
      <div className="tools">
        <p className="tools__label">{tools.label}</p>
        <div className="tools__rows">
          {tools.rows.map((row, i) => (
            <ul key={i} className="tools__row">
              {row.map((tool) => (
                <li key={tool} className="tools__item">
                  {tool}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="intro__main">
        <div className="intro__copy">
          <h2 className="title title--muted">
            {intro.title.map((line) => (
              <span key={line} className="display__line">
                {line}
              </span>
            ))}
          </h2>
          <p className="intro__body">{intro.body}</p>
        </div>

        <div className="dock" aria-hidden="true">
          <span className="dock__stack">
            {icons[0].map((icon) => (
              <span key={icon.letter} className={`squircle squircle--${icon.tone}`}>
                {icon.letter}
              </span>
            ))}
          </span>
          <span className="squircle squircle--hero">
            <Mark size={48} color="#FCFCF9" />
          </span>
          <span className="dock__stack dock__stack--offset">
            {icons[1].map((icon) => (
              <span key={icon.letter} className={`squircle squircle--${icon.tone}`}>
                {icon.letter}
              </span>
            ))}
          </span>
        </div>

        <a className="btn btn--sky" href={intro.cta.href}>
          {intro.cta.label} ↓
        </a>
      </div>
    </div>
  );
}
