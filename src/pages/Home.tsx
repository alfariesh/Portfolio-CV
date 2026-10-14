import { caseStudy } from "../case-studies";
import { Blurb, Cell, Head, Orbit } from "../components/Grid";
import { Hero } from "../components/Hero";
import { Intro } from "../components/Intro";
import { ProjectArt } from "../components/ProjectArt";
import { WorkRow } from "../components/WorkRow";
import { about, now, profile, sections, studio } from "../content";
import { figures } from "../iso/figures";
import { IsoFigure } from "../iso/IsoFigure";
import { formatDate, notes } from "../notes";
import { Link } from "../router/Link";
import { Seo } from "../components/Seo";

// Selected work as rows; Rekanesia leads the design-systems section instead.
const featured = [caseStudy("vuboi"), caseStudy("surau"), caseStudy("ipubers")];

export function Home() {
  const { work, systems, process, contact } = sections;

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
            <Link className="link link--accent" href={work.link.href}>
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
          <ProjectArt art="rekanesia" />
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

        <Cell span={1} className="cell--note" id="notes">
          <div className="note__art">
            <IsoFigure fig={figures.studio} aspect={3 / 2} />
          </div>
          <div className="note__copy">
            <div>
              <h3 className="blurb__title">{studio.title}</h3>
              <ul className="latest">
                {notes.slice(0, 3).map((note) => (
                  <li key={note.slug}>
                    <Link className="latest__item" href={`/notes/${note.slug}`}>
                      <time dateTime={note.date}>{formatDate(note.date)}</time>
                      <span>{note.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link className="link link--strong" href={studio.link.href}>
              {studio.link.label}
            </Link>
          </div>
        </Cell>

        <Cell span={1} className="cell--note" id="about">
          <div className="note__art">
            <IsoFigure fig={figures.about} aspect={3 / 2} />
          </div>
          <div className="note__copy">
            <div>
              <h3 className="blurb__title">{about.title}</h3>
              <p className="blurb__body">{about.body}</p>
            </div>
            <a className="link link--strong" href={about.link.href}>
              {about.link.label}
            </a>
          </div>
        </Cell>
      </div>
    </>
  );
}
