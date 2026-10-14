import { ViewTransition } from "react";
import type { PictogramName } from "../art/pictogram-data";
import { Pictogram } from "../art/pictograms";
import { Scaler } from "./Scaler";

export type CoverProps = {
  /** Two to four characters, set huge in outline. */
  word: string;
  glyph: PictogramName;
  tone?: "accent" | "moss" | "yolk" | "plum";
};

type NoteCoverProps = CoverProps & { slug: string; label: string };

// Typographic cover for a note: outline type, an overprinted swatch and one
// Rekanesia pictogram. Drawn at 540×360 and scaled to its column, so the same
// cover can travel from the list to the article in a view transition.
export function NoteCover({ slug, label, word, glyph, tone = "accent" }: NoteCoverProps) {
  return (
    <ViewTransition name={`note-cover-${slug}`} share="morph" default="none">
      <Scaler width={540} height={360} className="cover" grow>
        <div className={`art art--cover cover--${tone}`} aria-hidden="true">
          <span className="cover__label">{label}</span>
          <span className="cover__word">{word}</span>
          <span className="cover__ink" />
          <span className="cover__dots" />
          <span className="cover__glyph">
            <Pictogram name={glyph} size={132} />
          </span>
          <span className="cover__tape" />
        </div>
      </Scaler>
    </ViewTransition>
  );
}
