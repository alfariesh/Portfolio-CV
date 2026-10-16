import { useFigure, type FigureKey } from "../iso/figures";
import { IsoFigure } from "../iso/IsoFigure";

type ProjectArtProps = { art: FigureKey; interactive?: boolean };

// A case study's iso-glow figure at 4:3, on the home page and as the page
// hero. The shared name lets a route change carry it from one to the other.
export function ProjectArt({ art, interactive = false }: ProjectArtProps) {
  return (
    <IsoFigure
      fig={useFigure(art)}
      name={`art-${art}`}
      interactive={interactive}
      demo={interactive ? "mount" : "visible"}
    />
  );
}
