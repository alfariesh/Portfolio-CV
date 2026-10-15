// Copy and links for the home page, nav and footer. Case studies live in
// src/case-studies/*.mdx and notes in src/notes/*.mdx.
import { caseStudies } from "./case-studies";
import type { IconName } from "./components/Icon";

export const profile = {
  name: "Salman Alfariesh",
  handle: "salman",
  role: "product designer & design engineer",
  location: "Indonesia",
  // TODO: replace with your real contact details before publishing.
  email: "hello@example.com",
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
  { label: "work", href: "/#work", icon: "work", page: "/work" },
  { label: "systems", href: "/#systems", icon: "grid" },
  { label: "process", href: "/#process", icon: "flow" },
  { label: "notes", href: "/#notes", icon: "notes", page: "/notes" },
  { label: "about", href: "/#about", icon: "user" },
];

export const hero = {
  lead: "design, then ship it",
  muted: ["a product designer who", "turns canvases into code"],
  body: "I'm Salman — I design interfaces, design systems and mobile apps, then build them in React, React Native and Swift. Canvas and codebase, one continuous loop.",
  primary: { label: "see selected work", href: "#work" },
  secondary: { label: "currently open to new work →", href: "#contact" },
};

export const tools = {
  label: "tools I design and ship with",
  rows: [
    ["Paper", "React", "SwiftUI", "TypeScript", "Vite+", "Supabase"],
    ["React Native", "Expo", "Cloudflare", "Claude Code", "HeroUI"],
  ],
};

export const intro = {
  title: ["hello, I'm Salman", "one designer, one canvas,", "a whole connected workflow"],
  body: "I work where design meets engineering: prototyping on the canvas, syncing tokens to code, and pairing with agents so the craft gets the attention, not the boilerplate.",
  cta: { label: "view selected work", href: "#work" },
};

export const sections = {
  work: {
    eyebrow: "selected work",
    title: "from canvas to code, and back again",
    link: { label: "see all work", href: "/work" },
    body: "from a national subsidy system to products I build myself — each one designed with real content, real constraints and the people who use it",
  },
  systems: {
    eyebrow: "design systems",
    title: "one source of truth, many brands",
    body: "Rekanesia: tokens, components and a pipeline built once and used everywhere — from the design file all the way to five platforms",
    points: [
      {
        title: "the seven-day rebrand, delivered in two",
        body: "when a national program needed the whole app rebranded in a week, variable design tokens turned it into a two-day job",
        href: "/work/rekanesia#the-seven-day-rebrand-delivered-in-two",
        cta: "read the case study",
      },
      {
        title: "one source, five platforms",
        body: "one token file compiles to Flutter, Compose, CSS, Android XML and Swift, and re-skins 30 components into five brands",
        href: "/work/rekanesia#ai-in-the-loop",
        cta: "see how",
      },
    ],
  },
  process: {
    eyebrow: "process",
    title: "hand off the boilerplate, keep the human touch",
    body: "agents read my canvas, scaffold the components and sync the tokens. I stay on taste, motion and the details that make it feel alive",
    link: { label: "how this site was built →", href: "/notes/rebuilding-in-an-afternoon" },
    points: [
      {
        title: "agents that see the canvas",
        body: "MCP connects the design file to the editor, so components start from the real design, not from a screenshot",
      },
      {
        title: "stay in control",
        body: "every generated line is reviewed, formatted, linted and type-checked with Vite+ before it ships",
      },
    ],
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
    body: "I'm open to product design, design-system and design-engineering work. Tell me what you're building.",
    cta: "say hello",
  },
};

export const now = {
  title: ["Now", "&Next"],
  body: "exploring agent-assisted design systems, SwiftUI motion and faster web toolchains. Always happy to trade notes.",
  cta: { label: "read the notes", href: "/notes" },
};

export const about = {
  title: "about Salman",
  body: "a designer who codes. I sketch on the canvas, ship in React and Swift, and let agents handle the boilerplate",
  link: { label: "download résumé →", href: profile.resumeUrl },
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
