import { Cursor } from "./Cursor";
import { ChickenGoals, MiniScreen, NumiOnboarding, VuboiHome } from "./screens";

const phones = [
  { id: "vuboi", label: "Vuboi / Home", x: 112, y: 150, w: 240, screen: <VuboiHome /> },
  {
    id: "chicken-bank",
    label: "Chicken Bank / Goals",
    x: 408,
    y: 96,
    w: 264,
    screen: <ChickenGoals />,
  },
  { id: "numi", label: "Numi / Onboarding", x: 728, y: 150, w: 240, screen: <NumiOnboarding /> },
];

// Where the cursor rests when a phone is in focus.
const cursorAt: Record<string, { x: number; y: number }> = {
  vuboi: { x: 300, y: 420 },
  "chicken-bank": { x: 640, y: 300 },
  numi: { x: 920, y: 470 },
};

// `focus` dims the other phones, for a case study about one of them.
export function PhonesArt({ focus }: { focus?: string }) {
  const cursor = (focus && cursorAt[focus]) || cursorAt["chicken-bank"];
  return (
    <div className="art art--phones">
      {phones.map((p) => (
        <figure
          key={p.label}
          className={focus && focus !== p.id ? "phone is-dim" : "phone"}
          style={{ left: p.x, top: p.y }}
        >
          <figcaption className="art__label">{p.label}</figcaption>
          <div className="phone__screen">
            <MiniScreen width={p.w}>{p.screen}</MiniScreen>
          </div>
        </figure>
      ))}
      <Cursor name="Salman" tone="you" x={cursor.x} y={cursor.y} />
    </div>
  );
}
