import { caseStudy } from "../case-studies";
import { Blurb, Cell, Head, Orbit } from "../components/Grid";
import { Hero } from "../components/Hero";
import { Intro } from "../components/Intro";
import { WorkRow } from "../components/WorkRow";
import { NoteCover } from "../components/NoteCover";
import { Tag } from "../components/Tag";
import { about, now, profile, sections } from "../content";
import { figures } from "../iso/figures";
import { IsoFigure } from "../iso/IsoFigure";
import { formatDate, notes } from "../notes";
import { Link } from "../router/Link";
import { Seo } from "../components/Seo";

// The three strongest case studies; /work has all six.
const featured = [caseStudy("rekanesia"), caseStudy("surau"), caseStudy("vuboi")];

// The newest notes, one per column; /notes has the rest.
const latest = notes.slice(0, 2);

export function Home() {
  const { work, systems, process, notes: notesSection, contact } = sections;

  return (
    <>
      <Seo path="/" />
      <Hero />

      <div className="grid">
        <Cell tone="clear" className="cell--intro">
          <Intro />
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

        <Cell className="cell--head" id="systems">
          <Head eyebrow={systems.eyebrow} title={systems.title} body={systems.body} />
        </Cell>
        <Cell className="cell--art">
          <IsoFigure fig={figures.tokens} interactive />
        </Cell>
        {systems.points.map((point) => (
          <Cell key={point.title} span={1}>
            <Blurb {...point} />
          </Cell>
        ))}

        <Cell className="cell--head" id="process">
          <Head eyebrow={process.eyebrow} title={process.title} body={process.body}>
            <Link className="link link--accent" href={process.link.href}>
              {process.link.label}
            </Link>
          </Head>
        </Cell>
        <Cell className="cell--art">
          <IsoFigure fig={figures.loop} interactive />
        </Cell>
        {process.points.map((point) => (
          <Cell key={point.title} span={1}>
            <Blurb title={point.title} body={point.body} />
          </Cell>
        ))}

        <Cell className="cell--head" id="notes">
          <Head eyebrow={notesSection.eyebrow} title={notesSection.title} body={notesSection.body}>
            <Link className="btn btn--ink" href={notesSection.link.href}>
              {notesSection.link.label}
            </Link>
          </Head>
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

        <article className="feature-row" id="about">
          <div className="cell feature-row__art">
            <IsoFigure fig={figures.about} />
          </div>
          <div className="cell feature-row__copy">
            <p className="feature-row__meta">about</p>
            <div>
              <h2 className="feature-row__title">{about.title}</h2>
              <p className="feature-row__summary">{about.body}</p>
              <a className="link link--accent feature-row__cta" href={about.link.href}>
                {about.link.label}
              </a>
            </div>
          </div>
        </article>

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

        <Cell className="cell--now">
          <div className="now__texture" aria-hidden="true" />
          <div className="now__card">
            <div className="now__copy">
              <h2 className="now__title">
                {now.title[0]}
                <span>{now.title[1]}</span>
              </h2>
              <p className="now__body">{now.body}</p>
            </div>
            <Link className="btn btn--ink" href={now.cta.href}>
              {now.cta.label}
            </Link>
          </div>
          <span className="decor decor--tape" aria-hidden="true">
            <i />
            <i />
          </span>
          <span className="decor decor--halftone" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="decor decor--weave" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </Cell>
      </div>
    </>
  );
}
