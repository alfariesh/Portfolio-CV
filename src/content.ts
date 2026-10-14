// All copy for the site lives here. Edit this file to make the portfolio yours.

export const profile = {
  name: "Salman Alfariesh",
  handle: "salman",
  role: "product designer & design engineer",
  location: "Indonesia",
  // TODO: replace with your real contact details before publishing.
  email: "hello@example.com",
  resumeUrl: "#",
};

export const nav = [
  { label: "work", href: "#work" },
  { label: "systems", href: "#systems" },
  { label: "process", href: "#process" },
  { label: "about", href: "#about" },
  { label: "notes", href: "#notes" },
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

export type Project = {
  slug: string;
  name: string;
  kind: string;
  summary: string;
};

export const projects: Project[] = [
  {
    slug: "vuboi",
    name: "Vuboi",
    kind: "mobile app",
    summary:
      "a calm mobile experience designed on the canvas and built in React Native, sharing one token set across iOS and Android",
  },
  {
    slug: "chicken-bank",
    name: "Chicken Bank",
    kind: "iOS app",
    summary:
      "a playful savings app, prototyped on the canvas with real data and rebuilt natively in SwiftUI",
  },
  {
    slug: "rekanesia-pictograms",
    name: "Rekanesia",
    kind: "pictogram family",
    summary:
      "a pictogram family drawn on one shared grid, so every icon feels like it belongs to the same voice",
  },
  {
    slug: "rekanesia-states",
    name: "Rekanesia",
    kind: "status states",
    summary:
      "a complete vocabulary of states — draft, in review, approved, rejected — designed as tokens, not one-offs",
  },
];

export const sections = {
  work: {
    eyebrow: "selected work",
    title: "from canvas to code, and back again",
    body: "a few recent projects — each one designed on the canvas, prototyped with real content and shipped by the same pair of hands",
  },
  systems: {
    eyebrow: "design systems",
    title: "systems that scale, pictograms that speak",
    body: "tokens, states and icon families built once and used everywhere — from the canvas all the way to the component library",
  },
  process: {
    eyebrow: "process",
    title: "hand off the boilerplate, keep the human touch",
    body: "agents read my canvas, scaffold the components and sync the tokens. I stay on taste, motion and the details that make it feel alive",
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
  cta: { label: "read the notes", href: "#notes" },
};

export const notes = [
  {
    id: "notes",
    title: "what's new in the studio",
    body: "october, 2026: rebuilt this portfolio with Vite+, designed on a Paper canvas and shipped in an afternoon",
    link: { label: "build log →", href: "#notes" },
  },
  {
    id: "about",
    title: "about Salman",
    body: "a designer who codes. I sketch on the canvas, ship in React and Swift, and let agents handle the boilerplate",
    link: { label: "download résumé →", href: profile.resumeUrl },
  },
];

export const footer = {
  columns: [
    {
      title: "portfolio",
      links: [
        { label: "home", href: "#top" },
        { label: "work", href: "#work" },
        { label: "process", href: "#process" },
        { label: "about", href: "#about" },
      ],
    },
    {
      title: "projects",
      links: [
        { label: "Vuboi", href: "#work" },
        { label: "Chicken Bank", href: "#work" },
        { label: "Rekanesia", href: "#systems" },
        { label: "Numi", href: "#work" },
        { label: "iPubers", href: "#work" },
      ],
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
