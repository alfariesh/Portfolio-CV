import { pictogramMarkup } from "./pictogram-markup";

export type PictogramName = keyof typeof pictogramMarkup;

export const pictogramNames = Object.keys(pictogramMarkup) as PictogramName[];
