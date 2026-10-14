import { useState, useTransition, ViewTransition } from "react";
import { Cell } from "../components/Grid";
import { NoteCover } from "../components/NoteCover";
import { Icon } from "../components/Icon";
import { Tag } from "../components/Tag";
import { tagIcons } from "../components/tag-icons";
import { formatDate, notes, tags, type Tag as TagName } from "../notes";
import { Link } from "../router/Link";

type Filter = TagName | "all";

const filters: Filter[] = ["all", ...tags];
const count = (filter: Filter) =>
  filter === "all" ? notes.length : notes.filter((note) => note.tag === filter).length;

export function NotesPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [isPending, startTransition] = useTransition();
  const visible = filter === "all" ? notes : notes.filter((note) => note.tag === filter);

  return (
    <>
      <title>notes — Salman Alfariesh</title>
      <div className="grid">
        <Cell className="cell--masthead">
          <div className="masthead">
            <h1 className="masthead__title">
              <span className="masthead__accent">margins</span>
              <span>notes from the studio</span>
            </h1>
            <p className="masthead__body">
              short notes on experiments, workflows and prompts: what worked, what didn't, and why.
              The occasional essay, and demos you can play with.
            </p>
          </div>
          <div className="filters" role="group" aria-label="Filter notes by tag">
            {filters.map((option) => (
              <button
                key={option}
                type="button"
                className="filter"
                aria-pressed={filter === option}
                disabled={count(option) === 0}
                onClick={() => startTransition(() => setFilter(option))}
              >
                <Icon name={tagIcons[option]} size={16} />
                {option}
                <span className="filter__count">{count(option)}</span>
              </button>
            ))}
          </div>
        </Cell>

        <div className="feature-list" aria-busy={isPending || undefined}>
          {visible.map((note, i) => (
            <ViewTransition key={note.slug} enter="list-in" exit="list-out" update="list-move">
              <article className={i % 2 ? "feature-row feature-row--flip" : "feature-row"}>
                <Link
                  className="cell feature-row__art"
                  href={`/notes/${note.slug}`}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <NoteCover slug={note.slug} cover={note.cover} />
                </Link>
                <div className="cell feature-row__copy">
                  <div className="feature-row__meta">
                    <time dateTime={note.date}>{formatDate(note.date)}</time>
                    <Tag tag={note.tag} />
                  </div>
                  <div>
                    <h2 className="feature-row__title">
                      <Link href={`/notes/${note.slug}`}>{note.title}</Link>
                    </h2>
                    <p className="feature-row__summary">{note.summary}</p>
                    <Link
                      className="link link--accent feature-row__cta"
                      href={`/notes/${note.slug}`}
                    >
                      read the note →
                    </Link>
                  </div>
                </div>
              </article>
            </ViewTransition>
          ))}
        </div>
      </div>
    </>
  );
}
