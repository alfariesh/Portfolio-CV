import type { MDXContent } from "mdx/types";
import type { CoverProps } from "../components/NoteCover";

// Notes are short MDX files in this folder: `export const meta = {...}` on top,
// three to five paragraphs below. The file name is the URL slug (/notes/<slug>).
export const tags = ["experiment", "workflow", "essay", "demo"] as const;
export type Tag = (typeof tags)[number];

export type NoteMeta = {
  title: string;
  /** One or two sentences for the list and the page header. */
  summary: string;
  /** ISO date, e.g. "2026-10-12". */
  date: string;
  tag: Tag;
  cover: CoverProps;
};

export type Note = NoteMeta & { slug: string; Content: MDXContent };

const files = import.meta.glob<{ meta: NoteMeta; default: MDXContent }>("./*.mdx", {
  eager: true,
});

// Newest first.
export const notes: Note[] = Object.entries(files)
  .map(([path, file]) => ({
    ...file.meta,
    slug: path.slice(2, -".mdx".length),
    Content: file.default,
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
