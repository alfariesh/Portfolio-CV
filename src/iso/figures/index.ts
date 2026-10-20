import { chunk, useChunk } from "../../chunk";
import type { IsoFig } from "../types";

// Every iso-glow figure on the site, by key. Case studies name theirs in
// `meta.art`, notes in `meta.cover`. Preview them all at /iso-glow/ (dev only).
// Each figure is its own chunk, so a page only downloads the ones it draws
// (src/preload.ts loads them before the page renders). The key is the file
// name in this folder.
const figure = (key: string, load: () => Promise<IsoFig>) =>
  chunk(`src/iso/figures/${key}.ts`, load);

export const figures = {
  ipubers: figure("ipubers", () => import("./ipubers").then((m) => m.ipubers)),
  vuboi: figure("vuboi", () => import("./vuboi").then((m) => m.vuboi)),
  numi: figure("numi", () => import("./numi").then((m) => m.numi)),
  rekan: figure("rekan", () => import("./rekan").then((m) => m.rekan)),
  surau: figure("surau", () => import("./surau").then((m) => m.surau)),
  rekanesia: figure("rekanesia", () => import("./rekanesia").then((m) => m.rekanesia)),
  loop: figure("loop", () => import("./loop").then((m) => m.loop)),
  studio: figure("studio", () => import("./studio").then((m) => m.studio)),
  about: figure("about", () => import("./about").then((m) => m.about)),
  "zero-folds": figure("zero-folds", () => import("./zero-folds").then((m) => m.zeroFolds)),
  rebuild: figure("rebuild", () => import("./rebuild").then((m) => m.rebuild)),
  essay: figure("essay", () => import("./essay").then((m) => m.essay)),
  tokens: figure("tokens", () => import("./tokens").then((m) => m.tokens)),
  pictograms: figure("pictograms", () => import("./pictograms").then((m) => m.pictograms)),
};

export type FigureKey = keyof typeof figures;

export function useFigure(key: FigureKey) {
  return useChunk(figures[key]);
}
