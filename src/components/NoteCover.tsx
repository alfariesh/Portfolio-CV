import { figures, type FigureKey } from "../iso/figures";
import { IsoFigure } from "../iso/IsoFigure";

type NoteCoverProps = { slug: string; cover: FigureKey; interactive?: boolean };

// A note's iso-glow figure at 3:2. The shared name carries it from the list
// into the note.
export function NoteCover({ slug, cover, interactive = false }: NoteCoverProps) {
  return (
    <IsoFigure
      fig={figures[cover]}
      aspect={3 / 2}
      name={`note-cover-${slug}`}
      interactive={interactive}
      demo={interactive ? "mount" : "visible"}
    />
  );
}
