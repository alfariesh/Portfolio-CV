import { Cursor } from "../art/Cursor";
import { pictogramNames } from "../art/pictogram-data";
import { Pictogram } from "../art/pictograms";
import { MiniScreen, NumiOnboarding, VuboiHome } from "../art/screens";
import { profile } from "../content";
import { Icon, type IconName } from "./Icon";

const tabs = ["Portfolio 2026", "Rekanesia", "Vuboi", "Surau", "iPubers"];
const pages = ["Selected work", "Systems", "Process", "About"];
const artboards = [
  "Vuboi / Planner",
  "Vuboi / Tracker",
  "Rekanesia / Pictograms",
  "Rekanesia / Stepper",
  "Surau / Answer",
  "Numi / Onboarding",
  "iPubers / Redemption",
];
const tools: IconName[] = ["pointer", "hand", "frame", "rect", "pen", "text"];
const about = [
  ["Role", "Product designer"],
  ["Craft", "Design × code"],
  ["Stack", "React · Swift"],
  ["Based", profile.location],
];
const terminal = [
  { cmd: "paper – get_jsx (MCP)", out: "Hero section · 14 layers" },
  {
    cmd: "vp create vite -- --template react-ts",
    out: "Scaffolded portfolio with React + TypeScript",
  },
  { cmd: "paper – get_computed_styles (MCP)", out: "ink #23251D · paper #FEFEFC · line #BFC1B7" },
  { cmd: "vp check", out: "pass: no lint or type errors" },
];

// A faux design-tool window. Projects are artboards, the inspector is the bio.
export function CanvasMock() {
  return (
    <div className="cm">
      <div className="cm__bar">
        <span className="cm__lights">
          <i />
          <i />
          <i />
        </span>
        {tabs.map((tab, i) => (
          <span key={tab} className={`cm__tab${i === 0 ? " is-active" : ""}`}>
            <Icon name={i === 0 ? "file" : "page"} size={14} />
            {tab}
            {i === 0 && <Icon name="close" size={11} className="cm__tab-close" />}
          </span>
        ))}
      </div>

      <div className="cm__body">
        <aside className="cm__left">
          <div className="cm__file">
            <Icon name="file" size={15} />
            <span>Portfolio 2026</span>
            <Icon name="panel" size={15} className="cm__push" />
          </div>
          <div className="cm__group">
            <div className="cm__group-head">
              <Icon name="chevron" size={12} />
              Pages
              <Icon name="plus" size={14} className="cm__push" />
            </div>
            {pages.map((page, i) => (
              <div key={page} className="cm__row">
                <Icon name="page" size={14} />
                {page}
                {i === 0 && <Icon name="check" size={14} className="cm__push" />}
              </div>
            ))}
          </div>
          <div className="cm__group">
            <div className="cm__group-head">
              <Icon name="chevron" size={12} />
              Artboards
            </div>
            {artboards.map((name, i) => (
              <div key={name} className={`cm__row cm__row--layer${i === 0 ? " is-selected" : ""}`}>
                <Icon name="artboard" size={13} />
                {name}
                {i === 0 && <Icon name="eye" size={14} className="cm__push" />}
              </div>
            ))}
          </div>
          <div className="cm__foot">What's new · Feedback</div>
        </aside>

        <div className="cm__tools">
          {tools.map((tool, i) => (
            <span key={tool} className={i === 0 ? "is-active" : undefined}>
              <Icon name={tool} size={17} />
            </span>
          ))}
        </div>

        <div className="cm__canvas">
          <div className="cm__board" style={{ left: 124, top: 40 }}>
            <span className="cm__board-label">Vuboi / Planner</span>
            <div className="cm__selection">
              <MiniScreen width={196}>
                <VuboiHome />
              </MiniScreen>
              <i className="h h--tl" />
              <i className="h h--tr" />
              <i className="h h--bl" />
              <i className="h h--br" />
              <span className="cm__size">390 × 844</span>
            </div>
          </div>

          <div className="cm__board" style={{ left: 352, top: 40 }}>
            <span className="cm__board-label">Rekanesia / Pictograms</span>
            <div className="cm__picto">
              {pictogramNames.slice(0, 9).map((name) => (
                <span key={name}>
                  <Pictogram name={name} size={26} />
                </span>
              ))}
            </div>
          </div>

          <div className="cm__board" style={{ left: 352, top: 292 }}>
            <span className="cm__board-label">Rekanesia / Stepper</span>
            <div className="cm__states">
              {[
                ["− 1 +", "draft"],
                ["30 kg", "review"],
                ["50 kg", "ok"],
                ["custom", "archived"],
              ].map(([label, tone]) => (
                <span key={label} className={`chip chip--${tone}`}>
                  <i />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="cm__board" style={{ left: 600, top: 40 }}>
            <span className="cm__board-label">Numi / Onboarding</span>
            <MiniScreen width={196}>
              <NumiOnboarding />
            </MiniScreen>
          </div>

          <Cursor name="Salman" tone="you" x={318} y={150} />
          <Cursor name="Claude" tone="agent" x={560} y={360} />
        </div>

        <aside className="cm__right">
          <div className="cm__people">
            <span className="avatar avatar--you">SA</span>
            <span className="avatar avatar--agent">
              <Icon name="bolt" size={12} />
            </span>
            <span className="cm__zoom">71%</span>
          </div>
          <div className="cm__share">
            <Icon name="link" size={13} />
            Copy link <span className="cm__kbd">⌘ L</span>
          </div>

          <div className="cm__section">
            <div className="cm__section-head">About</div>
            {about.map(([k, v]) => (
              <div key={k} className="cm__prop">
                <span>{k}</span>
                <b>{v}</b>
              </div>
            ))}
          </div>

          <div className="cm__section">
            <div className="cm__section-head">Layout</div>
            <div className="cm__fields">
              {[
                ["X", "124"],
                ["Y", "40"],
                ["W", "390"],
                ["H", "844"],
              ].map(([k, v]) => (
                <span key={k} className="cm__field">
                  <i>{k}</i>
                  {v}
                </span>
              ))}
            </div>
          </div>

          <div className="cm__section">
            <div className="cm__section-head">Status</div>
            <span className="cm__status">
              <i />
              open to new work
            </span>
          </div>

          <div className="cm__section">
            <div className="cm__section-head">
              Fill
              <Icon name="plus" size={13} className="cm__push" />
            </div>
            <div className="cm__fill">
              <span className="cm__swatch" />
              paper-light
              <span className="cm__push cm__dim">100 %</span>
            </div>
          </div>
        </aside>

        <div className="cm__term">
          <div className="cm__term-bar">
            <span className="cm__lights">
              <i />
              <i />
              <i />
            </span>
            ~/Documents/Portofolio
          </div>
          <div className="cm__term-body">
            {terminal.map((line) => (
              <div key={line.cmd} className="cm__term-step">
                <p>
                  <i>●</i> {line.cmd}
                </p>
                <p className="cm__term-out">└ {line.out}</p>
              </div>
            ))}
            <p className="cm__term-prompt">
              <i>❯</i> ship it
              <span className="cm__caret" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
