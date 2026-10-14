import type { CaseStudy } from "../case-studies";
import { Link } from "../router/Link";
import { ProjectArt } from "./ProjectArt";

type WorkRowProps = { study: CaseStudy; flip?: boolean; heading?: "h2" | "h3" };

// A case study as a two-cell row: its figure and its summary. The figure keeps
// its shared name, so it travels into the case study hero.
export function WorkRow({ study, flip = false, heading: Heading = "h3" }: WorkRowProps) {
  const href = `/work/${study.slug}`;
  return (
    <article className={flip ? "feature-row feature-row--flip" : "feature-row"}>
      <Link className="cell feature-row__art" href={href} tabIndex={-1} aria-hidden="true">
        <ProjectArt art={study.art} />
      </Link>
      <div className="cell feature-row__copy">
        <p className="feature-row__meta">
          {study.kind} · {study.year}
        </p>
        <div>
          <Heading className="feature-row__title">
            <Link href={href}>{study.title}</Link>
          </Heading>
          <p className="feature-row__summary">{study.summary}</p>
          <Link className="link link--accent feature-row__cta" href={href}>
            read the case study →
          </Link>
        </div>
      </div>
    </article>
  );
}
