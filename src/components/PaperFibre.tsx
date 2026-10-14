import { PaperTexture } from "@paper-design/shaders-react";

type PaperFibreProps = {
  className: string;
  paper?: string;
  shadow?: string;
  amount?: number;
};

// Static paper fibre (WebGL). Folds, wrinkles and crumples stay off so the
// texture never adds lines next to the grid. Load it lazily: the shader is
// split into its own chunk and the plain background shows until it is ready.
export default function PaperFibre({
  className,
  paper = "#FEFEFC",
  shadow = "#BFC1B7",
  amount = 0.3,
}: PaperFibreProps) {
  return (
    <PaperTexture
      className={className}
      colorBack={paper}
      colorPaper={paper}
      colorShadow={shadow}
      roughness={amount}
      fiber={amount}
      folds={0}
      wrinkles={0}
      crumples={0}
      drops={0}
      distortion={0}
      fit="cover"
      scale={1}
      aria-hidden="true"
    />
  );
}
