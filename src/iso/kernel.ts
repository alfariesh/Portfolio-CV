// Isometric kernel from the iso-glow skill (built on iso-figure by Tolga Cohce,
// MIT, github.com/MrBongoC/ai-iso-skill). +x runs down-right, +y down-left,
// +z up. Faces are SVG groups transformed onto the TOP, FRONT (y = max) and
// SIDE (x = max) planes, so ordinary rects and text land on them.

export type Point3 = [x: number, y: number, z: number];

const C = Math.cos(Math.PI / 6);
const S = Math.sin(Math.PI / 6);

export function kernel(OX: number, OY: number) {
  const P = (x: number, y: number, z: number): [number, number] => [
    (x - y) * C + OX,
    (x + y) * S - z + OY,
  ];
  const D = (x: number, y: number, z: number): [number, number] => [(x - y) * C, (x + y) * S - z];
  const plane = (O: Point3, U: Point3, V: Point3) => {
    const o = P(...O);
    const u = D(...U);
    const v = D(...V);
    return `matrix(${u[0]} ${u[1]} ${v[0]} ${v[1]} ${o[0]} ${o[1]})`;
  };
  const TOP = (x: number, y: number, z: number) => plane([x, y, z], [1, 0, 0], [0, 1, 0]);
  const FRONT = (x: number, y: number, z: number) => plane([x, y, z], [1, 0, 0], [0, 0, -1]);
  const SIDE = (x: number, y: number, z: number) => plane([x, y, z], [0, -1, 0], [0, 0, -1]);
  const rect = (t: string, w: number, h: number, r = 0, cls = "face") =>
    `<g transform="${t}"><rect class="${cls}" width="${w}" height="${h}" rx="${r}"/></g>`;

  // Rounded box: one rounded top plus one continuous side wall along the
  // visible part of the outline, so the corners meet cleanly.
  const rounded = (
    x: number,
    y: number,
    z: number,
    w: number,
    d: number,
    h: number,
    radius: number,
    cls: string,
  ) => {
    const r = Math.min(radius, w / 2, d / 2);
    const n = 10;
    const z1 = z + h;
    const q = Math.PI / 4;
    const H = Math.PI / 2;
    const c = cls ? ` ${cls}` : "";
    const arc = (cx: number, cy: number, a0: number, a1: number) => {
      const out: [number, number][] = [];
      for (let i = 0; i <= n; i++) {
        const a = a0 + ((a1 - a0) * i) / n;
        out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
      }
      return out;
    };
    const ring = [
      ...arc(x + w - r, y + r, -H, 0),
      ...arc(x + w - r, y + d - r, 0, H),
      ...arc(x + r, y + d - r, H, 2 * H),
      ...arc(x + r, y + r, 2 * H, 3 * H),
    ];
    const visible = [
      ...arc(x + w - r, y + r, -q, 0),
      ...arc(x + w - r, y + d - r, 0, H),
      ...arc(x + r, y + d - r, H, 3 * q),
    ];
    const d3 = (pts: Point3[]) =>
      `M${pts
        .map((p) =>
          P(...p)
            .map((v) => v.toFixed(2))
            .join(" "),
        )
        .join("L")}Z`;
    const wall: Point3[] = [
      ...visible.map(([a, b]): Point3 => [a, b, z]),
      ...visible
        .slice()
        .reverse()
        .map(([a, b]): Point3 => [a, b, z1]),
    ];
    return `<path class="face${c}" d="${d3(wall)}"/><path class="face top${c}" d="${d3(ring.map(([a, b]): Point3 => [a, b, z1]))}"/>`;
  };

  // A box is its three visible faces, drawn with an opaque top. Thin trim
  // against a wall belongs on the wall's FRONT/SIDE plane instead.
  const box = (x: number, y: number, z: number, w: number, d: number, h: number, r = 0) =>
    r > 0
      ? rounded(x, y, z, w, d, h, r, "")
      : rect(SIDE(x + w, y + d, z + h), d, h) +
        rect(FRONT(x, y + d, z + h), w, h) +
        rect(TOP(x, y, z + h), w, d, 0, "face top");

  // Same, with extra classes on every face (e.g. "recess").
  const boxc = (
    x: number,
    y: number,
    z: number,
    w: number,
    d: number,
    h: number,
    r: number,
    cls: string,
  ) =>
    r > 0
      ? rounded(x, y, z, w, d, h, r, cls)
      : rect(SIDE(x + w, y + d, z + h), d, h, 0, `face ${cls}`) +
        rect(FRONT(x, y + d, z + h), w, h, 0, `face ${cls}`) +
        rect(TOP(x, y, z + h), w, d, 0, `face top ${cls}`);

  // 3D polyline -> SVG path "d".
  const path = (pts: Point3[]) =>
    `M${pts
      .map((p) =>
        P(...p)
          .map((n) => n.toFixed(2))
          .join(" "),
      )
      .join("L")}`;

  return { C, S, P, D, plane, TOP, FRONT, SIDE, rect, box, boxc, path };
}

export type Kernel = ReturnType<typeof kernel>;
export type Frame = Kernel & { viewBox: string; W: number; H: number };

// Frame a scene from its extreme 3D corners (include the tallest point).
// Returns the kernel plus a viewBox padded to `aspect`.
export function frame(points: Point3[], margin = 0.09, aspect = 4 / 3): Frame {
  const d = points.map(([x, y, z]) => [(x - y) * C, (x + y) * S - z]);
  const x0 = Math.min(...d.map((p) => p[0]));
  const x1 = Math.max(...d.map((p) => p[0]));
  const y0 = Math.min(...d.map((p) => p[1]));
  const y1 = Math.max(...d.map((p) => p[1]));
  const m = margin * Math.max(x1 - x0, y1 - y0);
  let w = x1 - x0 + 2 * m;
  let h = y1 - y0 + 2 * m;
  let ox = m - x0;
  let oy = m - y0;
  if (w / h < aspect) {
    const nw = h * aspect;
    ox += (nw - w) / 2;
    w = nw;
  } else {
    const nh = w / aspect;
    oy += (nh - h) / 2;
    h = nh;
  }
  return { ...kernel(ox, oy), viewBox: `0 0 ${w.toFixed(1)} ${h.toFixed(1)}`, W: w, H: h };
}

// Parallel hairlines in a face-local group: at a0, a0 + step … a1, each
// spanning b0 → b1. Vertical lines by default.
export function slits(
  a0: number,
  a1: number,
  step: number,
  b0: number,
  b1: number,
  vertical = true,
  cls = "detail",
) {
  let s = "";
  for (let a = a0; a <= a1 + 1e-6; a += step) {
    s += vertical
      ? `<line class="${cls}" x1="${a}" y1="${b0}" x2="${a}" y2="${b1}"/>`
      : `<line class="${cls}" x1="${b0}" y1="${a}" x2="${b1}" y2="${a}"/>`;
  }
  return s;
}

export const esc = (s: unknown) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
