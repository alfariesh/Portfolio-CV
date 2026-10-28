import { caseStudies } from "../case-studies";
import { FactList } from "../components/FactList";
import { Cell } from "../components/Grid";
import { Icon, type IconName } from "../components/Icon";
import { Seo } from "../components/Seo";
import { toolLogos } from "../components/tool-logos";
import { facts, profile, sections } from "../content";
import { Link } from "../router/Link";
import { site } from "../seo";

// The résumé: the about section's facts on one page an employer can open or
// print ("save as PDF" gives one or two A4 pages; see "Print" at the end of
// src/styles/pages.css). Every fact comes from src/content.ts, the tools from
// the about section's tool belt and the work from the case studies' meta.
//
// TODO: missing from the content, so left out rather than guessed:
// - a line or two of responsibilities and results for each role
// - the degree earned at Al-Azhar (only the subject, "Islamic theology", is known)
// - languages spoken

const portfolio = new URL(site.url);

type ContactFact = { label: string; icon: IconName; value: string; href?: string; wide?: boolean };

const contact: ContactFact[] = [
  { label: "role", icon: "user", value: profile.role },
  { label: "based in", icon: "home", value: profile.location },
  { label: "email", icon: "link", value: profile.email, href: `mailto:${profile.email}` },
  { label: "portfolio", icon: "work", value: portfolio.hostname, href: portfolio.href, wide: true },
  ...Object.entries(profile.socials)
    .filter(([, href]) => href)
    .map(([name, href]) => ({
      label: name,
      icon: name as IconName,
      value: new URL(href).host + new URL(href).pathname,
      href,
    })),
];

export function ResumePage() {
  const { about } = sections;

  return (
    <>
      <Seo path="/resume" />
      <div className="grid resume">
        <Cell className="cell--masthead cell--resume-head">
          <div className="masthead">
            <h1 className="masthead__title">
              <span className="masthead__accent">résumé</span>
              <span>{profile.name}</span>
            </h1>
            <p className="masthead__body">{about.body}</p>
          </div>
          <button className="btn btn--ink resume__print" type="button" onClick={() => print()}>
            <Icon name="page" size={14} />
            print or save as pdf
          </button>
        </Cell>

        <Cell className="cell--facts">
          <dl className="facts resume__contact">
            {contact.map((fact) => (
              <div
                key={fact.label}
                className={fact.wide ? "facts__item facts__item--wide" : "facts__item"}
              >
                <dt className="caps facts__label">
                  <Icon name={fact.icon} size={16} />
                  {fact.label}
                </dt>
                <dd>
                  {fact.href ? (
                    <a className="link link--line" href={fact.href}>
                      {fact.value}
                    </a>
                  ) : (
                    fact.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Cell>

        <Cell className="cell--stats">
          <dl className="stats stats--row">
            {about.stats.map(([value, label]) => (
              <div key={label} className="stats__item">
                <dt className="stats__value">{value}</dt>
                <dd className="stats__label">{label}</dd>
              </div>
            ))}
          </dl>
        </Cell>

        <Cell span={1}>
          <FactList heading="h2" label="experience" icon="work" items={facts.experience} />
        </Cell>
        <Cell span={1}>
          <FactList heading="h2" label="education" icon="page" items={facts.education} />
        </Cell>
        <Cell span={1}>
          <FactList heading="h2" label="awards" icon="bolt" items={facts.awards} />
        </Cell>
        <Cell span={1}>
          <div className="bio">
            <h2 className="bio__label caps">
              <Icon name="grid" size={16} />
              expertise
            </h2>
            <ul className="skills">
              {facts.expertise.map((skill) => (
                <li key={skill} className="skill">
                  {skill}
                </li>
              ))}
            </ul>
            <h2 className="bio__label caps">
              <Icon name="plug" size={16} />
              tools
            </h2>
            <ul className="skills">
              {toolLogos.map((tool) => (
                <li key={tool.name} className="skill">
                  {tool.name}
                </li>
              ))}
            </ul>
          </div>
        </Cell>

        <Cell className="cell--resume-work">
          <div className="bio">
            <h2 className="bio__label caps">
              <Icon name="frame" size={16} />
              case studies
            </h2>
            <ul className="resume-work">
              {caseStudies.map((study) => (
                <li key={study.slug} className="resume-work__item">
                  <h3 className="blurb__title">
                    <Link className="link" href={`/work/${study.slug}`}>
                      {study.title}
                    </Link>
                  </h3>
                  <p className="bio__place">
                    {study.kind}: {study.role}
                  </p>
                  <span className="bio__years">{study.year}</span>
                </li>
              ))}
            </ul>
          </div>
        </Cell>
      </div>
    </>
  );
}
