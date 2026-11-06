import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";
import { Cursor } from "./Cursor";
import { CURSOR, tipOffset } from "./cursor-shape";
import { YouCursor } from "./YouCursor";

type Point = [number, number];

// The arrow's path only uses absolute M, L, C and Z commands; sample its curves.
function outline(path: string): Point[] {
  const points: Point[] = [];
  let at: Point = [0, 0];
  for (const [, command, args] of path.matchAll(/([MLCZ])([^MLCZ]*)/g)) {
    const n = (args.match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
    if (command === "M" || command === "L") {
      at = [n[0], n[1]];
      points.push(at);
    } else if (command === "C") {
      const [x1, y1, x2, y2, x, y] = n;
      for (let i = 1; i <= 50; i++) {
        const t = i / 50;
        const u = 1 - t;
        points.push([
          u ** 3 * at[0] + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t ** 3 * x,
          u ** 3 * at[1] + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t ** 3 * y,
        ]);
      }
      at = [x, y];
    }
  }
  return points;
}

describe("cursor shape", () => {
  const points = outline(CURSOR.path);

  it("keeps the arrow's tip where the shape says it is", () => {
    // The tip is the point furthest towards the top-left corner.
    const tip = points.reduce((best, p) => (p[0] + p[1] < best[0] + best[1] ? p : best));
    expect(tip[0]).toBeCloseTo(CURSOR.tip, 1);
    expect(tip[1]).toBeCloseTo(CURSOR.tip, 1);
  });

  it("stays inside its grid", () => {
    for (const [x, y] of points) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(CURSOR.box);
      expect(y).toBeLessThanOrEqual(CURSOR.box);
    }
  });
});

describe("<Cursor>", () => {
  const html = renderToString(<Cursor name="Fable 5.5" color="--accent" x={10} y={20} />);

  it("draws the shared arrow, hidden from assistive tech, with its name tag", () => {
    expect(html).toContain(`d="${CURSOR.path}"`);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toMatch(/<b[^>]*>Fable 5\.5<\/b>/);
  });

  it("puts the arrow's tip on the point it is given", () => {
    expect(html).toContain("left:10px;top:20px");
    expect(html).toContain(`left:${-tipOffset}px;top:${-tipOffset}px`);
  });

  it("takes its colour from a page token", () => {
    expect(html).toContain("--c:var(--accent)");
  });
});

describe("the visitor's cursor", () => {
  it("renders nothing until a mouse has moved", () => {
    expect(renderToString(<YouCursor name="You" color="--violet" />)).toBe("");
  });
});
