import { Cursor } from "./Cursor";
import { ChickenGoals, MiniScreen, NumiOnboarding, VuboiHome } from "./screens";

const phones = [
  { label: "Vuboi / Home", x: 112, y: 150, w: 240, screen: <VuboiHome /> },
  { label: "Chicken Bank / Goals", x: 408, y: 96, w: 264, screen: <ChickenGoals /> },
  { label: "Numi / Onboarding", x: 728, y: 150, w: 240, screen: <NumiOnboarding /> },
];

export function PhonesArt() {
  return (
    <div className="art art--phones">
      {phones.map((p) => (
        <figure key={p.label} className="phone" style={{ left: p.x, top: p.y }}>
          <figcaption className="art__label">{p.label}</figcaption>
          <div className="phone__screen">
            <MiniScreen width={p.w}>{p.screen}</MiniScreen>
          </div>
        </figure>
      ))}
      <Cursor name="Salman" tone="you" x={640} y={300} />
    </div>
  );
}
