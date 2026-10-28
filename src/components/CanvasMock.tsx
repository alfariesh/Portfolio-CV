import { Cursor } from "../art/Cursor";
import { pictogramNames } from "../art/pictogram-data";
import { Pictogram } from "../art/pictograms";
import { MiniScreen, NumiOnboarding, VuboiHome } from "../art/screens";
import { profile } from "../content";
import { Icon, type IconName } from "./Icon";

const tabs = ["Portfolio 2026", "Rekanesia", "Vuboi", "Surau", "iPubers"];
const pages = ["About", "Process", "Selected work", "Notes"];
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
  { cmd: "paper – get_computed_styles (MCP)", out: "ink #23251D · paper #FEFEFC · line #D8DAD1" },
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
          <Cursor name="Fable 5.5" tone="agent" x={170} y={330} />
          <Cursor name="Astra 6.1" tone="agent" x={560} y={360} />
        </div>

        <aside className="cm__right">
          <div className="cm__people">
            <span className="avatar avatar--you">SA</span>
            <span className="avatar avatar--claude" role="img" aria-label="Claude">
              <svg
                viewBox="0 0 24 24"
                width="13"
                height="13"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
              </svg>
            </span>
            <span className="avatar avatar--gpt" role="img" aria-label="ChatGPT">
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M11.7453 14.85L6.90436 12V7C6.90436 4.79086 8.72949 3 10.9809 3C12.3782 3 13.6113 3.6898 14.3458 4.74128" />
                <path d="M9.59961 19.1791C10.3266 20.2757 11.5866 21.0008 13.0192 21.0008C15.2707 21.0008 17.0958 19.21 17.0958 17.0008V12.0008L12.1612 9.0957" />
                <path d="M9.45166 13.5L9.45123 7.66938L13.8642 5.16938C15.814 4.06481 18.3072 4.72031 19.4329 6.63348C20.1593 7.86806 20.1388 9.32466 19.5089 10.4995" />
                <path d="M4.48963 13.4993C3.8595 14.6742 3.83887 16.131 4.56539 17.3657C5.6911 19.2789 8.18428 19.9344 10.1341 18.8298L14.5471 16.3298L14.643 10.7344" />
                <path d="M17.0959 17.6309C18.4415 17.5734 19.7295 16.8634 20.4529 15.634C21.5786 13.7209 20.9106 11.2745 18.9608 10.1699L14.5478 7.66992L9.48907 10.4255" />
                <path d="M6.90454 6.36938C5.55865 6.42662 4.27032 7.13672 3.54684 8.3663C2.42113 10.2795 3.08917 12.7258 5.03896 13.8304L9.45196 16.3304L14.5 13.5807" />
              </svg>
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
