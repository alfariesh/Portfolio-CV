// Copy and links for the home page, nav and footer. Case studies live in
// src/case-studies/*.mdx and notes in src/notes/*.mdx.
import { caseStudies } from "./case-studies";
import type { IconName } from "./components/Icon";

export const profile = {
  name: "Salman Alfariesh",
  handle: "salman",
  role: "product designer & design engineer",
  location: "Indonesia",
  email: "hi@salman.ai.id",
  // TODO: link the résumé PDF before publishing.
  resumeUrl: "#",
};

// Shown on every page. Every item is a section of the home page, linked as
// /#section; `page` is the index page that also counts as that section (the
// header and bottom bar mark it current there). The icons sit next to the
// labels in the header and alone in the bottom bar on small screens.
export type NavItem = {
  label: string;
  href: `/#${string}`;
  icon: IconName;
  page?: string;
};

export const nav: NavItem[] = [
  { label: "about", href: "/#about", icon: "user" },
  { label: "process", href: "/#process", icon: "flow" },
  { label: "work", href: "/#work", icon: "work", page: "/work" },
  { label: "notes", href: "/#notes", icon: "notes", page: "/notes" },
];

export const hero = {
  lead: "design, then ship it",
  muted: ["a product designer who", "turns canvases into code"],
  body: "I'm Salman — I design interfaces, design systems and mobile apps, then build them in React, React Native and Swift. Canvas and codebase, one continuous loop.",
  primary: { label: "see selected work", href: "#work" },
  secondary: { label: "currently open to new work →", href: "#contact" },
};

// The band under the hero: every product with a case study, set like a logo
// wall and linked to its page.
export const shipped = {
  label: "products I've designed and shipped",
};

// The home page reads top to bottom: about, process, work, notes, contact.
export const sections = {
  about: {
    eyebrow: "about",
    title: "five years of products people use every day",
    body: "a UI/UX designer who works end to end: field research with kiosk owners, design systems a whole holding company builds on, and prototypes I code myself",
    link: { label: "download résumé →", href: profile.resumeUrl },
    tools: "tools I design and ship with",
    stats: [
      ["5+", "years designing end-to-end products"],
      ["28,000+", "kiosks running the system I designed"],
      ["5", "brands from one token file"],
      ["2", "international awards for Rekan"],
    ] as [string, string][],
  },
  process: {
    eyebrow: "how I work",
    title: "from the field to the codebase",
    body: "research before pixels, a system before screens, and agents for the boilerplate so the details get my attention",
    link: { label: "how this site was built →", href: "/notes/rebuilding-in-an-afternoon" },
    steps: [
      {
        title: "start in the field",
        body: "I sit with the people who will use it: kiosk owners, distributors, the staff behind the counter. Their day decides the design",
      },
      {
        title: "build the system first",
        body: "variable tokens and multi-brand themes come before screens, so a rebrand is a two-day job instead of a week",
      },
      {
        title: "prototype in code",
        body: "agents read the canvas and scaffold the components, so stakeholders test a working web prototype, not a slideshow",
      },
      {
        title: "ship it with care",
        body: "every generated line is reviewed, formatted, linted and type-checked before it ships. Taste and motion stay with me",
      },
    ],
  },
  work: {
    eyebrow: "selected work",
    title: "from canvas to code, and back again",
    link: { label: "see all work", href: "/work" },
    body: "a multi-brand design system, an Islamic wiki built on classical texts and a national subsidy app: real content, real constraints, real people",
  },
  notes: {
    eyebrow: "notes",
    title: "notes from the studio",
    body: "short notes on experiments, workflows and prompts: what worked, what didn't, and why",
    link: { label: "see all notes", href: "/notes" },
  },
  contact: {
    eyebrow: "let's talk",
    title: "have a product that deserves the details?",
    body: "I'm open to product design, design-system and design-engineering roles, remote or in Jakarta. Tell me what you're building.",
    cta: "say hello",
  },
};

// The about section's fact sheet, from the résumé. Newest first in each group.
export type Fact = { title: string; place: string; years: string };

type Facts = {
  experience: Fact[];
  education: Fact[];
  awards: Fact[];
  expertise: string[];
};

export const facts: Facts = {
  experience: [
    { title: "UI/UX designer", place: "PT Pupuk Indonesia, Jakarta", years: "2021 – now" },
    { title: "graphic designer", place: "MAK Travel, Egypt", years: "2020" },
  ],
  education: [
    {
      title: "UI/UX design bootcamp",
      place: "Purwadhika Digital Technology School",
      years: "2021",
    },
    { title: "Islamic theology", place: "Al-Azhar University, Cairo", years: "2016 – 2020" },
  ],
  awards: [
    {
      title: "Gold Stevie® Award",
      place: "innovation in shopping or e-commerce apps, for Rekan",
      years: "2023",
    },
    {
      title: "IDC Future Enterprise Award",
      place: "best in future of industry ecosystem, Asia-Pacific, for Rekan",
      years: "2022",
    },
  ],
  expertise: [
    "design systems",
    "multi-brand tokens",
    "mobile app design",
    "web dashboards",
    "field research",
    "user interviews",
    "AI-assisted prototyping",
    "developer handoff",
    "graphic design",
  ],
};

type FooterLink = { label: string; href: string; icon?: IconName };
type FooterColumn = { title: string; links: FooterLink[] };

export const footer: { columns: FooterColumn[] } = {
  columns: [
    {
      title: "portfolio",
      links: [
        { label: "home", href: "/", icon: "home" },
        { label: "work", href: "/work", icon: "work" },
        { label: "notes", href: "/notes", icon: "notes" },
        { label: "about", href: "/#about", icon: "user" },
      ],
    },
    {
      title: "case studies",
      links: caseStudies
        .filter((study) => !["numi", "rekan"].includes(study.slug))
        .map((study) => ({ label: study.title, href: `/work/${study.slug}` })),
    },
    {
      // TODO: point these at your real profiles.
      title: "elsewhere",
      links: [
        { label: "github", href: "#", icon: "github" },
        { label: "linkedin", href: "#", icon: "linkedin" },
        { label: "dribbble", href: "#", icon: "dribbble" },
        { label: "instagram", href: "#", icon: "instagram" },
      ],
    },
  ],
};
