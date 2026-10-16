// The Atom feed of the notes at /notes/feed.xml, written by the prerender
// (scripts/prerender.ts) through the server entry. Each entry carries the
// note's full body, rendered with the same MDX components as the page, minus
// the parts that only work on the site.
import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { proseComponents } from "./components/prose";
import { profile } from "./content";
import { notes, type Note } from "./notes";
import { absolute, notesFeed, seoFor } from "./seo";

export const escapeXml = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// Notes carry a date, not a time; Atom wants both.
const timestamp = (date: string) => `${date}T00:00:00Z`;

// Feed readers show the body on another origin, so in-site links become
// absolute, and the WebGL demo becomes a link to the page it runs on.
function bodyComponents(note: Note): MDXComponents {
  return {
    ...proseComponents,
    a: ({ href = "", ...props }: ComponentProps<"a">) => (
      <a href={href.startsWith("/") ? absolute(href) : href} {...props} />
    ),
    PaperDemo: () => (
      <p>
        <a href={absolute(`/notes/${note.slug}`)}>try the live demo on the site →</a>
      </p>
    ),
  };
}

function entry(note: Note) {
  const url = absolute(`/notes/${note.slug}`);
  const { Content } = note;
  const body = renderToStaticMarkup(<Content components={bodyComponents(note)} />);
  return `  <entry>
    <id>${escapeXml(url)}</id>
    <title>${escapeXml(note.title)}</title>
    <link rel="alternate" type="text/html" href="${escapeXml(url)}"/>
    <published>${timestamp(note.date)}</published>
    <updated>${timestamp(note.date)}</updated>
    <category term="${escapeXml(note.tag)}"/>
    <summary>${escapeXml(note.summary)}</summary>
    <content type="html">${escapeXml(body)}</content>
  </entry>`;
}

/** The whole feed, newest note first (the order `notes` already has). */
export function feed() {
  const home = absolute("/");
  const notesUrl = absolute("/notes");
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">
  <id>${escapeXml(notesUrl)}</id>
  <title>${escapeXml(`${notesFeed.title} | ${profile.name}`)}</title>
  <subtitle>${escapeXml(seoFor("/notes").description)}</subtitle>
  <link rel="self" type="application/atom+xml" href="${escapeXml(absolute(notesFeed.path))}"/>
  <link rel="alternate" type="text/html" href="${escapeXml(notesUrl)}"/>
  <updated>${timestamp(notes[0].date)}</updated>
  <author>
    <name>${escapeXml(profile.name)}</name>
    <uri>${escapeXml(home)}</uri>
  </author>
  <icon>${escapeXml(absolute("/favicon-96.png"))}</icon>
${notes.map(entry).join("\n")}
</feed>
`;
}
