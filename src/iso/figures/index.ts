import { ipubers } from "./ipubers";
import { vuboi } from "./vuboi";
import { numi } from "./numi";
import { rekan } from "./rekan";
import { surau } from "./surau";
import { rekanesia } from "./rekanesia";
import { loop } from "./loop";
import { studio } from "./studio";
import { about } from "./about";
import { zeroFolds } from "./zero-folds";
import { rebuild } from "./rebuild";
import { essay } from "./essay";
import { tokens } from "./tokens";
import { pictograms } from "./pictograms";

// Every iso-glow figure on the site, by key. Case studies name theirs in
// `meta.art`, notes in `meta.cover`. Preview them all at /iso-glow/ (dev only).
export const figures = {
  ipubers,
  vuboi,
  numi,
  rekan,
  surau,
  rekanesia,
  loop,
  studio,
  about,
  "zero-folds": zeroFolds,
  rebuild,
  essay,
  tokens,
  pictograms,
};

export type FigureKey = keyof typeof figures;
