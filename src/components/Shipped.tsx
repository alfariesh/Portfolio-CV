import { caseStudies } from "../case-studies";
import { shipped } from "../content";
import { Link } from "../router/Link";

const rows = [caseStudies.slice(0, 3), caseStudies.slice(3)];

// The band under the hero: every product with a case study, set like a logo
// wall, each name a door to its page.
export function Shipped() {
  return (
    <div className="shipped">
      <p className="shipped__label">{shipped.label}</p>
      <div className="shipped__rows">
        {rows.map((row, i) => (
          <ul key={i} className="shipped__row">
            {row.map((study) => (
              <li key={study.slug}>
                <Link className="shipped__item" href={`/work/${study.slug}`} title={study.kind}>
                  {study.title}
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
