import { caseStudies } from "../case-studies";
import { Cell } from "../components/Grid";
import { WorkRow } from "../components/WorkRow";

export function WorkPage() {
  return (
    <>
      <title>work — Salman Alfariesh</title>
      <div className="grid">
        <Cell className="cell--masthead">
          <div className="masthead">
            <h1 className="masthead__title">
              <span className="masthead__accent">casebook</span>
              <span>work, 2021 to now</span>
            </h1>
            <p className="masthead__body">
              six products, from fertiliser kiosks across Indonesia to a wiki built on classical
              texts. Each one splits the work honestly: what a machine did, and what stayed a human
              decision.
            </p>
          </div>
        </Cell>
        <div className="feature-list">
          {caseStudies.map((study, i) => (
            <WorkRow key={study.slug} study={study} flip={i % 2 === 1} heading="h2" />
          ))}
        </div>
      </div>
    </>
  );
}
