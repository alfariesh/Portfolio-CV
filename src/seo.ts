// What search engines and link previews see for every page: title,
// description, canonical URL, social card and structured data. One entry per
// indexable URL; the prerender (scripts/prerender.ts) writes a static HTML
// file for each, the sitemap lists them and scripts/og.ts draws their cards.
import { caseStudies } from "./case-studies";
import { facts, footer, profile } from "./content";
import { figures, type FigureKey } from "./iso/figures";
import { notes } from "./notes";

export const site = {
  // The canonical origin. Change it here when a custom domain is added: every
  // canonical, og:url, structured-data URL, the sitemap and robots.txt follow.
  url: "https://salman-alfariesh.alfarieshsalman.workers.dev",
  name: profile.name,
  locale: "en_US",
};

export const absolute = (path: string) => new URL(path, site.url).href;

/** The notes' Atom feed (src/feed.tsx), linked from every page's head. */
export const notesFeed = { path: "/notes/feed.xml", title: "notes from the studio" };

/** The social card is a 1200×630 PNG drawn by scripts/og.ts from `card`. */
export const ogSize = { width: 1200, height: 630 };
export const ogImage = (path: string) => (path === "/" ? "/og/home.png" : `/og${path}.png`);

export type PageSeo = {
  path: string;
  /** The <title>: the page first, the site name last after a pipe. */
  title: string;
  description: string;
  type: "website" | "article";
  /** ISO date the page was first published. */
  published?: string;
  /** What the social card shows; its title is also og:title. */
  card: { eyebrow: string; title: string; subtitle?: string; figure: FigureKey };
  /** schema.org nodes, emitted as one JSON-LD @graph. */
  schema: object[];
};

const personId = absolute("/#person");

const person = {
  "@type": "Person",
  "@id": personId,
  name: profile.name,
  alternateName: profile.handle,
  jobTitle: profile.role,
  url: absolute("/"),
  homeLocation: { "@type": "Country", name: profile.location },
  knowsAbout: ["product design", "design systems", "mobile app design", "React", "SwiftUI"],
  // Only profiles that are real links; placeholders ("#") stay out.
  sameAs: footer.columns
    .flatMap((column) => column.links)
    .map((link) => link.href)
    .filter((href) => href.startsWith("https://") && !href.startsWith(site.url)),
};

const author = { "@type": "Person", "@id": personId, name: profile.name, url: absolute("/") };

const breadcrumbs = (trail: [name: string, path: string][]) => ({
  "@type": "BreadcrumbList",
  itemListElement: [["home", "/"] as const, ...trail].map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: absolute(path),
  })),
});

const home: PageSeo = {
  path: "/",
  title: `${profile.name} | ${profile.role}`,
  description:
    "Salman Alfariesh is a product designer and design engineer in Indonesia. Interfaces, design systems and mobile apps, designed on canvas and shipped in React, React Native and Swift.",
  type: "website",
  card: {
    eyebrow: "portfolio",
    title: profile.name,
    subtitle: "design, then ship it",
    figure: "about",
  },
  schema: [
    {
      "@type": "WebSite",
      "@id": absolute("/#website"),
      name: site.name,
      alternateName: [profile.handle, new URL(site.url).hostname],
      url: absolute("/"),
      inLanguage: "en",
      publisher: { "@id": personId },
    },
    {
      "@type": "ProfilePage",
      "@id": absolute("/"),
      url: absolute("/"),
      name: `${profile.name} | ${profile.role}`,
      mainEntity: person,
    },
  ],
};

const work: PageSeo = {
  path: "/work",
  title: `work, 2021 to now: six case studies | ${profile.name}`,
  description:
    "Six product case studies, from fertiliser kiosks across Indonesia to a wiki built on classical texts. Each one splits the work honestly: what a machine did, and what stayed a human decision.",
  type: "website",
  card: {
    eyebrow: "casebook",
    title: "work, 2021 to now",
    subtitle: "six case studies",
    figure: "loop",
  },
  schema: [breadcrumbs([["work", "/work"]])],
};

const notesIndex: PageSeo = {
  path: "/notes",
  title: `notes from the studio | ${profile.name}`,
  description:
    "Short notes on design and engineering experiments, workflows and prompts: what worked, what didn't, and why. The occasional essay, and demos you can play with.",
  type: "website",
  card: { eyebrow: "margins", title: "notes from the studio", figure: "studio" },
  schema: [breadcrumbs([["notes", "/notes"]])],
};

const resume: PageSeo = {
  path: "/resume",
  title: `résumé | ${profile.name}`,
  description:
    "The résumé of Salman Alfariesh, product designer and design engineer: UI/UX designer at PT Pupuk Indonesia since 2021, a Gold Stevie® and an IDC Future Enterprise award for Rekan, and Islamic theology at Al-Azhar University, Cairo.",
  type: "website",
  card: {
    eyebrow: "résumé",
    title: profile.name,
    subtitle: "experience, education and awards",
    figure: "about",
  },
  schema: [
    {
      "@type": "ProfilePage",
      "@id": absolute("/resume"),
      url: absolute("/resume"),
      name: `résumé | ${profile.name}`,
      mainEntity: {
        ...person,
        email: `mailto:${profile.email}`,
        knowsAbout: facts.expertise,
        alumniOf: facts.education.map((school) => ({
          "@type": "EducationalOrganization",
          name: school.place.split(",")[0],
        })),
        award: facts.awards.map((award) => `${award.title} (${award.years}), ${award.place}`),
        // The first entry is the current job.
        worksFor: { "@type": "Organization", name: facts.experience[0].place.split(",")[0] },
      },
    },
    breadcrumbs([["résumé", "/resume"]]),
  ],
};

const studyPages = caseStudies.map((study): PageSeo => {
  const path = `/work/${study.slug}`;
  return {
    path,
    title: `${study.title}: ${study.kind} case study | ${profile.name}`,
    description: `${study.title} case study: ${study.summary}.`,
    type: "article",
    card: {
      eyebrow: `case study · ${study.kind}`,
      title: study.title,
      subtitle: study.tagline,
      figure: study.art,
    },
    schema: [
      {
        "@type": "Article",
        headline: `${study.title}: ${study.tagline}`,
        description: study.summary,
        image: [absolute(ogImage(path))],
        url: absolute(path),
        author,
        about: study.kind,
      },
      breadcrumbs([
        ["work", "/work"],
        [study.title, path],
      ]),
    ],
  };
});

const notePages = notes.map((note): PageSeo => {
  const path = `/notes/${note.slug}`;
  return {
    path,
    title: `${note.title} | ${profile.name}`,
    description: note.summary,
    type: "article",
    published: note.date,
    card: { eyebrow: `notes · ${note.tag}`, title: note.title, figure: note.cover },
    schema: [
      {
        "@type": "BlogPosting",
        headline: note.title,
        description: note.summary,
        image: [absolute(ogImage(path))],
        url: absolute(path),
        datePublished: note.date,
        author,
        keywords: note.tag,
      },
      breadcrumbs([
        ["notes", "/notes"],
        [note.title, path],
      ]),
    ],
  };
});

/** Every indexable page, in sitemap order. */
export const pages: PageSeo[] = [home, work, notesIndex, resume, ...studyPages, ...notePages];

export function seoFor(path: string) {
  const page = pages.find((entry) => entry.path === path);
  if (!page) throw new Error(`No SEO entry for ${path}; add it in src/seo.ts`);
  return page;
}

/** The figure's own description, first sentence only, as the card's alt text. */
export function cardAlt(page: PageSeo) {
  const scene = figures[page.card.figure].aria.split(/(?<=\.)\s/)[0];
  return `${page.card.title}: ${scene}`;
}
