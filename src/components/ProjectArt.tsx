import { ViewTransition } from "react";
import { artwork, type ArtKey } from "../art/artwork";
import { LoopArt } from "../art/LoopArt";
import { PhonesArt } from "../art/PhonesArt";
import { SystemsArt } from "../art/SystemsArt";
import { Scaler } from "./Scaler";

type ProjectArtProps = { art: ArtKey; focus?: string };

// The same illustration on the home page and as the case study hero. The shared
// name lets a route change carry it from one page to the other.
export function ProjectArt({ art, focus }: ProjectArtProps) {
  const { width, height, label } = artwork[art];
  return (
    <ViewTransition name={`art-${art}`} share="morph" default="none">
      <Scaler width={width} height={height} label={label}>
        {art === "phones" ? (
          <PhonesArt focus={focus} />
        ) : art === "systems" ? (
          <SystemsArt />
        ) : (
          <LoopArt />
        )}
      </Scaler>
    </ViewTransition>
  );
}
