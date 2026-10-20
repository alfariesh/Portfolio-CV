import type { CSSProperties } from "react";
import { caseStudy } from "../case-studies";
import { Cell, Fold, Head, Orbit } from "../components/Grid";
import { FactList } from "../components/FactList";
import { Icon } from "../components/Icon";
import { Hero } from "../components/Hero";
import { Shipped } from "../components/Shipped";
import { ToolBelt } from "../components/ToolBelt";
import { WorkRow } from "../components/WorkRow";
import { NoteCover } from "../components/NoteCover";
import { Tag } from "../components/Tag";
import { facts, featuredWork, profile, sections } from "../content";
import { figures } from "../iso/figures";
import { IsoFigure } from "../iso/IsoFigure";
import { formatDate, notes } from "../notes";
import { Link } from "../router/Link";
import { Seo } from "../components/Seo";

const featured = featuredWork.map((slug) => caseStudy(slug));

// The newest notes, one per column, then the next few as a list; /notes has
// the rest.
const latest = notes.slice(0, 2);
const earlier = notes.slice(2, 5);

export function Home() {
  const { about, process, work, notes: notesSection, contact } = sections;

  return (
    <>
      <Seo path="/" />
      <Hero />

      <div className="grid">
        <Cell tone="clear" className="cell--shipped">
          <Shipped />
        </Cell>

        <Cell span={1} className="cell--head cell--split" id="about">
          <Head eyebrow={about.eyebrow} title={about.title} body={about.body}>
            {about.link && (
              <Link className="link link--accent" href={about.link.href}>
                {about.link.label}
              </Link>
            )}
          </Head>
        </Cell>
        <Cell span={1} className="cell--art cell--split-art">
          <IsoFigure fig={figures.about} />
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
          <FactList label="experience" icon="work" items={facts.experience} />
        </Cell>
        <Cell span={1}>
          <FactList label="education" icon="page" items={facts.education} />
        </Cell>
        <Cell span={1}>
          <FactList label="awards" icon="bolt" items={facts.awards} />
        </Cell>
        <Cell span={1}>
          <div className="bio">
            <p className="bio__label caps">
              <Icon name="grid" size={16} />
              expertise
            </p>
            <ul className="skills">
              {facts.expertise.map((skill) => (
                <li key={skill} className="skill">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </Cell>

        <Cell className="cell--toolbelt">
          <ToolBelt label={about.tools} />
        </Cell>

        <Cell className="cell--head" id="process">
          <Fold corner="tr" />
          <Head eyebrow={process.eyebrow} title={process.title} body={process.body}>
            <Link className="link link--accent" href={process.link.href}>
              {process.link.label}
            </Link>
          </Head>
        </Cell>
        <Cell className="cell--art">
          <IsoFigure fig={figures.loop} interactive />
        </Cell>
        <Cell className="cell--path">
          <ol className="path">
            {process.steps.map((step, i) => (
              <li key={step.title} className="path__step" style={{ "--step": i } as CSSProperties}>
                <span className="path__node">{String(i + 1).padStart(2, "0")}</span>
                {i < process.steps.length - 1 && (
                  <span className="path__link" aria-hidden="true">
                    <svg viewBox="0 0 40 40" preserveAspectRatio="none">
                      <path d="M0 39.5L40 0" />
                    </svg>
                  </span>
                )}
                <h3 className="blurb__title">{step.title}</h3>
                <p className="blurb__body">{step.body}</p>
              </li>
            ))}
          </ol>
        </Cell>

        <Cell tone="clear" className="cell--orbit" id="work">
          <Orbit anchor="top" />
          <Head eyebrow={work.eyebrow} title={work.title} body={work.body} align="center">
            <Link className="btn btn--ink" href={work.link.href}>
              {work.link.label}
            </Link>
          </Head>
        </Cell>
        <div className="feature-list">
          {featured.map((study, i) => (
            <WorkRow key={study.slug} study={study} flip={i % 2 === 1} />
          ))}
        </div>

        <Cell span={1} className="cell--head cell--split" id="notes">
          <Head eyebrow={notesSection.eyebrow} title={notesSection.title} body={notesSection.body}>
            <Link className="btn btn--ink" href={notesSection.link.href}>
              {notesSection.link.label}
            </Link>
          </Head>
        </Cell>
        <Cell span={1} className="cell--index">
          <Fold corner="br" />
          <div className="index">
            <p className="caps">earlier notes</p>
            <ul className="index__list">
              {earlier.map((note) => (
                <li key={note.slug} className="index__item">
                  <time className="index__date" dateTime={note.date}>
                    {formatDate(note.date)}
                  </time>
                  <Link className="index__title" href={`/notes/${note.slug}`}>
                    {note.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Cell>
        {latest.map((note) => {
          const href = `/notes/${note.slug}`;
          return (
            <Cell key={note.slug} span={1} className="cell--note">
              <Link className="note__art" href={href} tabIndex={-1} aria-hidden="true">
                <NoteCover slug={note.slug} cover={note.cover} />
              </Link>
              <div className="note__copy">
                <div>
                  <div className="note__meta">
                    <time dateTime={note.date}>{formatDate(note.date)}</time>
                    <Tag tag={note.tag} />
                  </div>
                  <h3 className="blurb__title">
                    <Link href={href}>{note.title}</Link>
                  </h3>
                  <p className="blurb__body">{note.summary}</p>
                </div>
                <Link className="link link--accent" href={href}>
                  read the note →
                </Link>
              </div>
            </Cell>
          );
        })}

        <Cell tone="clear" className="cell--orbit cell--orbit-end" id="contact">
          <Orbit anchor="bottom" />
          <Head eyebrow={contact.eyebrow} title={contact.title} body={contact.body} align="center">
            <a className="btn btn--ink" href={`mailto:${profile.email}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M3 6h18v12H3Z M3 6l9 7 9-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              {contact.cta}
            </a>
          </Head>
        </Cell>
      </div>
    </>
  );
}
