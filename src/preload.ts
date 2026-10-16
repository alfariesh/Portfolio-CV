import { caseStudies, caseStudy, findCaseStudy } from "./case-studies";
import type { Chunk } from "./chunk";
import { featuredWork } from "./content";
import { figures, type FigureKey } from "./iso/figures";
import { findNote, notes } from "./notes";
import { matchRoute } from "./router/routes";
import { seoFor } from "./seo";

// The chunks a page renders: its figures, its social card's figure (<Seo>
// reads its alt text) and, for a case study or a note, its body. The client
// loads them before it hydrates (src/main.tsx) and before a route change
// (the router), the server before it renders, and the prerender lists them as
// modulepreload links. src/preload.test.tsx renders every page with only its
// own chunks loaded, so a page that starts drawing something new fails there
// until it is added here.
export function chunksFor(pathname: string): Chunk<unknown>[] {
  const route = matchRoute(pathname);
  const art: FigureKey[] = [];
  const bodies: Chunk<unknown>[] = [];

  switch (route.name) {
    case "home":
      // As drawn by src/pages/Home.tsx: about, the loop, the featured work
      // and the two newest notes.
      art.push("about", "loop", seoFor("/").card.figure);
      art.push(...featuredWork.map((slug) => caseStudy(slug).art));
      art.push(...notes.slice(0, 2).map((note) => note.cover));
      break;
    case "works":
      art.push(...caseStudies.map((study) => study.art), seoFor("/work").card.figure);
      break;
    case "work": {
      const study = findCaseStudy(route.slug);
      if (study) {
        art.push(study.art);
        bodies.push(study.body);
      }
      break;
    }
    case "notes":
      art.push(...notes.map((note) => note.cover), seoFor("/notes").card.figure);
      break;
    case "note": {
      const note = findNote(route.slug);
      if (note) {
        art.push(note.cover);
        bodies.push(note.body);
      }
      break;
    }
  }

  return [...[...new Set(art)].map((key) => figures[key]), ...bodies];
}

export function preloadPage(pathname: string) {
  return Promise.all(chunksFor(pathname).map((chunk) => chunk.load()));
}
