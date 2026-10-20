import type { MDXComponents } from "mdx/types";
import { AiLoop, Workflow } from "./AiLoop";
import { PaperDemo } from "./PaperDemo";
import { Callout, Heading, ProseLink, Stats } from "./Prose";

// Components available to every case study and note without an import.
export const proseComponents: MDXComponents = {
  a: ProseLink,
  h2: Heading,
  AiLoop,
  Workflow,
  Callout,
  PaperDemo,
  Stats,
};
