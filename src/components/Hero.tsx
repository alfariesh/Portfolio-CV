import { hero } from "../content";
import { CanvasMock } from "./CanvasMock";
import { Scaler } from "./Scaler";

export function Hero() {
  return (
    <>
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero__copy">
          <h1 id="hero-title" className="display">
            <span className="display__line">{hero.lead}</span>
            {hero.muted.map((line) => (
              <span key={line} className="display__line display__line--muted">
                {line}
              </span>
            ))}
          </h1>
          <p className="lede">{hero.body}</p>
        </div>
        <div className="hero__actions">
          <a className="btn btn--ink" href={hero.primary.href}>
            {hero.primary.label}
          </a>
          <a className="link link--muted" href={hero.secondary.href}>
            {hero.secondary.label}
          </a>
        </div>
      </section>
      <div className="showcase">
        <Scaler
          width={1322}
          height={720}
          className="showcase__frame"
          label="A design canvas showing Salman's portfolio projects as artboards, with an inspector describing his role and an agent terminal building the site."
        >
          <CanvasMock />
        </Scaler>
      </div>
    </>
  );
}
