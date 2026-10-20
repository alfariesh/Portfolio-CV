// Dev-only gallery of every iso-glow figure, served by `vp dev` at /iso-glow/.
// ?fig=<key> shows one figure; &w=<px> sets its width; &aspect=3/2 its shape;
// &still skips the demo.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import "./iso.css";
import { figures, type FigureKey } from "./figures";
import { IsoFigure } from "./IsoFigure";

const params = new URLSearchParams(location.search);
const only = params.get("fig") as FigureKey | null;
const width = Number(params.get("w")) || (only ? 1080 : 540);
const [a, b] = (params.get("aspect") ?? "4/3").split("/").map(Number);
const keys = (only ? [only] : Object.keys(figures)) as FigureKey[];

// Figures load on demand (src/iso/figures); fetch the ones shown up front.
const loaded = await Promise.all(keys.map((key) => figures[key].load()));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main style={{ display: "flex", flexWrap: "wrap", gap: 24, padding: 24 }}>
      {keys.map((key, i) => (
        <section key={key} style={{ width }}>
          <p className="caps" style={{ marginBottom: 8 }}>
            {key}
          </p>
          <IsoFigure
            fig={loaded[i]}
            aspect={a / b}
            interactive
            demo={params.has("still") ? "none" : "mount"}
          />
        </section>
      ))}
    </main>
  </StrictMode>,
);
