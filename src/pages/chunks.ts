import { chunk } from "../chunk";

// Each page is a chunk of its own, so a visit downloads only the page it
// shows (the résumé's tool logos stay out of a case study, and so on). The
// 404 page stays in the entry: it must never wait on the network. Read them
// with `useChunk` in src/App.tsx; src/preload.ts loads them with the rest.
const page = (file: string) => `src/pages/${file}.tsx`;

export const pageChunks = {
  home: chunk(page("Home"), () => import("./Home").then((m) => m.Home)),
  works: chunk(page("WorkPage"), () => import("./WorkPage").then((m) => m.WorkPage)),
  work: chunk(page("CaseStudyPage"), () => import("./CaseStudyPage").then((m) => m.CaseStudyPage)),
  notes: chunk(page("NotesPage"), () => import("./NotesPage").then((m) => m.NotesPage)),
  note: chunk(page("NotePage"), () => import("./NotePage").then((m) => m.NotePage)),
  resume: chunk(page("ResumePage"), () => import("./ResumePage").then((m) => m.ResumePage)),
};
