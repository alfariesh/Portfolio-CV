import { Cell } from "../components/Grid";
import { Mark } from "../components/Mark";
import { NoteCover } from "../components/NoteCover";
import { ProseBody } from "../components/prose/ProseBody";
import { Tag } from "../components/Tag";
import { profile } from "../content";
import { formatDate, notes, type Note } from "../notes";
import { Link } from "../router/Link";
import { Seo } from "../components/Seo";

// A single note, laid out like a sheet: cover, header, body, then the two
// notes around it.
export function NotePage({ note }: { note: Note }) {
  const index = notes.indexOf(note);
  const nearby = [notes[index - 1], notes[index + 1]].filter(Boolean);

  return (
    <>
      <Seo path={`/notes/${note.slug}`} />
      <article className="grid grid--sheet">
        <Cell span={1} className="cell--cover">
          <NoteCover slug={note.slug} cover={note.cover} interactive />
        </Cell>

        <Cell span={1} className="cell--article-head">
          <header className="article-head">
            <p className="article-head__meta">
              <time dateTime={note.date}>{formatDate(note.date)}</time>
              {note.updated && (
                <span>
                  updated <time dateTime={note.updated}>{formatDate(note.updated)}</time>
                </span>
              )}
              <Tag tag={note.tag} />
            </p>
            <h1 className="article-head__title">{note.title}</h1>
            <p className="article-head__lede">{note.summary}</p>
          </header>
        </Cell>

        <Cell span={1} className="cell--article-body">
          <div className="prose prose--single">
            <p className="byline">
              <span className="byline__avatar" aria-hidden="true">
                <Mark size={16} color="#FEFEFC" />
              </span>
              {profile.name}
            </p>
            <ProseBody body={note.body} />
          </div>
        </Cell>

        <Cell span={1} className="cell--more">
          <nav className="more" aria-label="More notes">
            <p className="caps">more notes</p>
            <ul className="latest">
              {nearby.map((other) => (
                <li key={other.slug}>
                  <Link className="latest__item" href={`/notes/${other.slug}`}>
                    <time dateTime={other.date}>{formatDate(other.date)}</time>
                    <span>{other.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link className="link link--strong" href="/notes">
              ← all notes
            </Link>
          </nav>
        </Cell>
      </article>
    </>
  );
}
