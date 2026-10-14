import type { MDXContent } from "mdx/types";
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

export type CaseStudy = CaseStudyMeta & { slug: string; Content: MDXContent };

const files = import.meta.glob<{ meta: CaseStudyMeta; default: MDXContent }>("./*.mdx", {
  eager: true,
});

export const caseStudies: CaseStudy[] = Object.entries(files)
  .map(([path, file]) => ({
    ...file.meta,
    slug: path.slice(2, -".mdx".length),
    Content: file.default,
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
