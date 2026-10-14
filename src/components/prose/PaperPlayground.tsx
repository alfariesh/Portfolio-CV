import { PaperTexture } from "@paper-design/shaders-react";

type PaperPlaygroundProps = { amount: number; lines: boolean };

// The footer's paper fibre with its settings exposed. Lazy-loaded by
// <PaperDemo>, so the shader stays in its own chunk.
export default function PaperPlayground({ amount, lines }: PaperPlaygroundProps) {
  return (
    <PaperTexture
      className="demo__paper"
      colorBack="#FEFEFC"
      colorPaper="#FEFEFC"
      colorShadow="#BFC1B7"
      roughness={amount}
      fiber={amount}
      folds={lines ? 0.6 : 0}
      wrinkles={lines ? 0.8 : 0}
      crumples={lines ? 0.35 : 0}
      drops={0}
      distortion={0}
      fit="cover"
      scale={1}
      aria-hidden="true"
    />
  );
}
