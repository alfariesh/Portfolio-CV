import { caseStudies, type CaseStudy } from "../case-studies";
import { Cell } from "../components/Grid";
import { ProjectArt } from "../components/ProjectArt";
import { proseComponents } from "../components/prose";
import { Link } from "../router/Link";

const number = (index: number) => String(index + 1).padStart(2, "0");

export function CaseStudyPage({ study }: { study: CaseStudy }) {
  const index = caseStudies.indexOf(study);
  const previous = caseStudies[(index - 1 + caseStudies.length) % caseStudies.length];
  const next = caseStudies[(index + 1) % caseStudies.length];
  const { Content } = study;

  const facts = [
    { label: "role", value: study.role },
    { label: "industry", value: study.industry },
    { label: "platform", value: study.platform },
    { label: "year", value: study.year },
  ];

  return (
    <>
      <title>{`${study.title} — case study · Salman Alfariesh`}</title>
      <div className="grid">
        <Cell className="cell--art">
          <ProjectArt art={study.art} interactive />
        </Cell>

        <Cell className="cell--head cell--cs-head">
          <div className="head">
            <p className="eyebrow">
              <Link className="link link--soft" href="/work">
                work
              </Link>
              <span className="eyebrow__sep"> / </span>
              case study {number(index)}
            </p>
            <h1 className="title title--stack">
              <span>{study.title}</span>
              <span className="title__muted">{study.tagline}</span>
            </h1>
            <p className="head__body">{study.summary}</p>
            {study.processOnly && (
              <p className="cs-nda">
                process only: names, data and screens are changed for confidentiality
              </p>
            )}
          </div>
        </Cell>

        <Cell className="cell--facts">
          <dl className="facts">
            {facts.map((fact) => (
              <div key={fact.label} className="facts__item">
                <dt className="caps">{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Cell>

        <Cell className="cell--prose">
          <div className="prose prose--split">
            <Content components={proseComponents} />
          </div>
        </Cell>

        <Cell span={1} className="cell--pager">
          <Link className="pager" href={`/work/${previous.slug}`}>
            <span className="caps">← previous</span>
            <span className="pager__title">{previous.title}</span>
            <span className="pager__kind">{previous.kind}</span>
          </Link>
        </Cell>
        <Cell span={1} className="cell--pager">
          <Link className="pager pager--next" href={`/work/${next.slug}`}>
            <span className="caps">next →</span>
            <span className="pager__title">{next.title}</span>
            <span className="pager__kind">{next.kind}</span>
          </Link>
        </Cell>
      </div>
    </>
  );
}
