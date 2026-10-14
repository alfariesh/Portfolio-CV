import { lazy, Suspense } from "react";
import { CollageArt, PortraitArt } from "../art/NotesArt";
import { caseStudy } from "../case-studies";
import { Blurb, Cell, Head, Orbit } from "../components/Grid";
import { Hero } from "../components/Hero";
import { Intro } from "../components/Intro";
import { ProjectArt } from "../components/ProjectArt";
import { Scaler } from "../components/Scaler";
import { about, now, profile, sections, studio } from "../content";
import { formatDate, notes } from "../notes";
import { Link } from "../router/Link";

const PaperFibre = lazy(() => import("../components/PaperFibre"));

const vuboi = caseStudy("vuboi");
const chicken = caseStudy("chicken-bank");

export function Home() {
  const { work, systems, process, contact } = sections;

  return (
    <>
      <title>Salman Alfariesh — design, then ship it</title>
      <Hero />

      <div className="grid">
        <Cell tone="clear" className="cell--intro">
          <Intro />
        </Cell>

        <Cell tone="clear" className="cell--orbit" id="work">
          <Orbit anchor="top" />
          <Head eyebrow={work.eyebrow} title={work.title} body={work.body} align="center" />
        </Cell>
        <Cell className="cell--art">
          <ProjectArt art="phones" />
        </Cell>
        {[vuboi, chicken].map((study) => (
          <Cell key={study.slug} span={1}>
            <Blurb
              title={`${study.title} — ${study.kind}`}
              body={study.summary}
              href={`/work/${study.slug}`}
            />
          </Cell>
        ))}

        <Cell className="cell--head" id="systems">
          <Head eyebrow={systems.eyebrow} title={systems.title} body={systems.body} />
        </Cell>
        <Cell className="cell--art">
          <ProjectArt art="systems" />
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
          <ProjectArt art="loop" />
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
            <Suspense fallback={null}>
              <PaperFibre className="note__paper" paper="#F4F4EF" shadow="#CFCFC8" amount={0.35} />
            </Suspense>
            <Scaler width={540} height={360}>
              <CollageArt />
            </Scaler>
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
            <Scaler width={540} height={360}>
              <PortraitArt />
            </Scaler>
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
