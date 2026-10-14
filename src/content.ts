// Copy and links for the home page, nav and footer. Case studies live in
// src/case-studies/*.mdx and notes in src/notes/*.mdx.
import { caseStudies } from "./case-studies";

export const profile = {
  name: "Salman Alfariesh",
  handle: "salman",
  role: "product designer & design engineer",
  location: "Indonesia",
  // TODO: replace with your real contact details before publishing.
  email: "hello@example.com",
  resumeUrl: "#",
};

// Shown on every page, so home sections are linked as /#section.
export const nav = [
  { label: "work", href: "/work" },
  { label: "systems", href: "/#systems" },
  { label: "process", href: "/#process" },
  { label: "about", href: "/#about" },
  { label: "notes", href: "/notes" },
] as const;

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
    link: { label: "all six projects →", href: "/work" },
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

export const studio = {
  title: "what's new in the studio",
  link: { label: "all notes →", href: "/notes" },
};

export const about = {
  title: "about Salman",
  body: "a designer who codes. I sketch on the canvas, ship in React and Swift, and let agents handle the boilerplate",
  link: { label: "download résumé →", href: profile.resumeUrl },
};

export const footer = {
  columns: [
    {
      title: "portfolio",
      links: [
        { label: "home", href: "/" },
        { label: "work", href: "/work" },
        { label: "notes", href: "/notes" },
        { label: "about", href: "/#about" },
      ],
    },
    {
      title: "case studies",
      links: caseStudies.map((study) => ({ label: study.title, href: `/work/${study.slug}` })),
    },
    {
      // TODO: point these at your real profiles.
      title: "elsewhere",
      links: [
        { label: "github", href: "#" },
        { label: "linkedin", href: "#" },
        { label: "dribbble", href: "#" },
        { label: "instagram", href: "#" },
      ],
    },
    {
      title: "colophon",
      links: [
        { label: "built with Vite+", href: "https://viteplus.dev" },
        { label: "designed in Paper", href: "https://paper.design" },
        { label: "set in system sans", href: "#top" },
      ],
    },
  ],
};
