import type { MDXContent } from "mdx/types";
import { chunk, type Chunk } from "../chunk";
import type { FigureKey } from "../iso/figures";

// Each case study is an MDX file in this folder: `export const meta = {...}`
// on top, the story below. The file name is the URL slug (/work/<slug>).
export type CaseStudyMeta = {
  title: string;
  kind: string;
  /** Second line of the page title, muted. */
  tagline: string;
  /** One sentence for the home page and the page header. */
  summary: string;
  year: string;
  role: string;
  industry: string;
  platform: string;
  /** iso-glow figure shown on the home page and as the page hero. */
  art: FigureKey;
  order: number;
  /** Set when the work is under NDA and only the process is shown. */
  processOnly?: boolean;
};

export type CaseStudy = CaseStudyMeta & { slug: string; body: Chunk<MDXContent> };

// The meta of every case study ships with the site (home and /work list them);
// `?meta` imports a copy of the file the build trims down to that export. The
// story is a chunk of its own, loaded for its page.
const metas = import.meta.glob<CaseStudyMeta>("./*.mdx", {
  eager: true,
  query: "?meta",
  import: "meta",
});
const bodies = import.meta.glob<MDXContent>("./*.mdx", { import: "default" });

export const caseStudies: CaseStudy[] = Object.entries(metas)
  .map(([path, meta]) => ({
    ...meta,
    slug: path.slice(2, -".mdx".length),
    body: chunk(`src/case-studies${path.slice(1)}`, bodies[path]),
  }))
  .sort((a, b) => a.order - b.order);

export function findCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}

export function caseStudy(slug: string) {
  const study = findCaseStudy(slug);
  if (!study) throw new Error(`No case study at src/case-studies/${slug}.mdx`);
  return study;
}
