import type { MDXContent } from "mdx/types";
import { chunk, type Chunk } from "../chunk";
import type { FigureKey } from "../iso/figures";

// Notes are short MDX files in this folder: `export const meta = {...}` on top,
// three to five paragraphs below. The file name is the URL slug (/notes/<slug>).
export const tags = [
  "experiment",
  "workflow",
  "prompt",
  "agent",
  "design-system",
  "plugin",
  "illustration",
  "essay",
  "video",
] as const;
export type Tag = (typeof tags)[number];

export type NoteMeta = {
  title: string;
  /** One or two sentences for the list and the page header. */
  summary: string;
  /** ISO date, e.g. "2026-10-12". */
  date: string;
  tag: Tag;
  /** iso-glow figure for the list and the page header. */
  cover: FigureKey;
};

export type Note = NoteMeta & { slug: string; body: Chunk<MDXContent> };

// Meta ships with the site, each body is its own chunk; see src/case-studies.
const metas = import.meta.glob<NoteMeta>("./*.mdx", {
  eager: true,
  query: "?meta",
  import: "meta",
});
const bodies = import.meta.glob<MDXContent>("./*.mdx", { import: "default" });

// Newest first.
export const notes: Note[] = Object.entries(metas)
  .map(([path, meta]) => ({
    ...meta,
    slug: path.slice(2, -".mdx".length),
    body: chunk(`src/notes${path.slice(1)}`, bodies[path]),
  }))
  .sort((a, b) => b.date.localeCompare(a.date));

export function findNote(slug: string) {
  return notes.find((note) => note.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
