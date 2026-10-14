import { LoopArt } from "./art/LoopArt";
import { CollageArt, PortraitArt } from "./art/NotesArt";
import { PhonesArt } from "./art/PhonesArt";
import { SystemsArt } from "./art/SystemsArt";
import { Backdrop } from "./components/Backdrop";
import { Footer } from "./components/Footer";
import { Blurb, Cell, Head, Orbit } from "./components/Grid";
import { Hero } from "./components/Hero";
import { Intro } from "./components/Intro";
import { Nav } from "./components/Nav";
import { Scaler } from "./components/Scaler";
import { notes, now, profile, projects, sections } from "./content";

const noteArt = { notes: <CollageArt />, about: <PortraitArt /> } as const;

export default function App() {
  const [vuboi, chicken, pictograms, states] = projects;
  const { work, systems, process, contact } = sections;

  return (
    <>
      <div className="sheet" id="top">
        <Backdrop />
        <Nav />
        <main>
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
              <Scaler
                width={1080}
                height={780}
                label="Three mobile screens: Vuboi home, Chicken Bank savings goal and Numi onboarding."
              >
                <PhonesArt />
              </Scaler>
            </Cell>
            <Cell span={1}>
              <Blurb title={`${vuboi.name} — ${vuboi.kind}`} body={vuboi.summary} />
            </Cell>
            <Cell span={1}>
              <Blurb title={`${chicken.name} — ${chicken.kind}`} body={chicken.summary} />
            </Cell>

            <Cell className="cell--head" id="systems">
              <Head eyebrow={systems.eyebrow} title={systems.title} body={systems.body} />
            </Cell>
            <Cell className="cell--art">
              <Scaler
                width={1080}
                height={840}
                label="The Rekanesia pictogram set on a 24 pixel grid, one icon enlarged with keylines, and a row of status chips."
              >
                <SystemsArt />
              </Scaler>
            </Cell>
            <Cell span={1}>
              <Blurb title={`${pictograms.name} — ${pictograms.kind}`} body={pictograms.summary} />
            </Cell>
            <Cell span={1}>
              <Blurb title={`${states.name} — ${states.kind}`} body={states.summary} />
            </Cell>

            <Cell className="cell--head" id="process">
              <Head eyebrow={process.eyebrow} title={process.title} body={process.body} />
            </Cell>
            <Cell className="cell--art">
              <Scaler
                width={1080}
                height={780}
                label="Design tokens on a canvas next to the same tokens as CSS in a code editor, connected by get_jsx and sync tokens arrows."
              >
                <LoopArt />
              </Scaler>
            </Cell>
            {process.points.map((point) => (
              <Cell key={point.title} span={1}>
                <Blurb title={point.title} body={point.body} />
              </Cell>
            ))}

            <Cell tone="clear" className="cell--orbit cell--orbit-end" id="contact">
              <Orbit anchor="bottom" />
              <Head
                eyebrow={contact.eyebrow}
                title={contact.title}
                body={contact.body}
                align="center"
              >
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
                <a className="btn btn--ink" href={now.cta.href}>
                  {now.cta.label}
                </a>
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

            {notes.map((note) => (
              <Cell key={note.id} span={1} className="cell--note" id={note.id}>
                <div className="note__art">
                  <Scaler width={540} height={360}>
                    {noteArt[note.id as keyof typeof noteArt]}
                  </Scaler>
                </div>
                <div className="note__copy">
                  <div>
                    <h3 className="blurb__title">{note.title}</h3>
                    <p className="blurb__body">{note.body}</p>
                  </div>
                  <a className="link link--strong" href={note.link.href}>
                    {note.link.label}
                  </a>
                </div>
              </Cell>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
