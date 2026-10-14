// Zero folds: the site's paper grain is a shader that can fold, wrinkle and
// crumple the sheet, but every fold is a line. A sheet on the plate and a
// small console: a "folds" toggle and a "fibre" knob (0.0 to 0.6).
import type { IsoFig } from "../types";

const MAX = 0.6;
const STEP = 0.05;

// Seeded random, so the grain is the same on every visit.
function rand(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const zeroFolds: IsoFig = {
  id: "zf",
  name: "Zero folds",
  hint: "click the toggle · space folds · ↑↓ fibre",
  aria: "Isometric sheet of paper on a plate beside a small console with a folds toggle and a fibre knob. Click the toggle or press space to turn folds on and off: crease lines and wrinkles appear across the sheet. Click the knob or press the up and down arrows to set the fibre from 0.0 to 0.6, shown as grain speckled over the sheet.",
  css: `
    [data-fig="zf"] .glass { vector-effect:non-scaling-stroke; }
    [data-fig="zf"] .zf-dot { fill:var(--ink); }
    [data-fig="zf"] .zf-fib { stroke:var(--ink); stroke-width:1; vector-effect:non-scaling-stroke; fill:none; }
    [data-fig="zf"] .zf-grain > * { transition:opacity .25s; }
    [data-fig="zf"] .zf-folds { opacity:0; transition:opacity .3s; }
    [data-fig="zf"] .zf-folds.on { opacity:1; }
    [data-fig="zf"] .zf-facet { fill:var(--recess); stroke:none; }
    [data-fig="zf"] .zf-crease { fill:none; stroke:var(--accent); stroke-width:1.2; vector-effect:non-scaling-stroke; stroke-linecap:round; }
    [data-fig="zf"] .zf-wrinkle { fill:none; stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; stroke-linecap:round; opacity:.7; }
    [data-fig="zf"] .zf-folds.go .zf-crease { stroke-dasharray:1000; animation:zf-draw .6s ease-out; }
    @keyframes zf-draw { from { stroke-dashoffset:1000; } to { stroke-dashoffset:0; } }
    [data-fig="zf"] .zf-arc { fill:none; stroke:var(--detail); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="zf"] .zf-val { fill:none; stroke:var(--accent); stroke-width:2.4; vector-effect:non-scaling-stroke; stroke-linecap:round; }
    [data-fig="zf"] .zf-ptr { stroke:var(--ink-hi); stroke-width:1.8; vector-effect:non-scaling-stroke; stroke-linecap:round; }
    [data-fig="zf"] .zf-lever { transition:transform .18s ease-out; }
    [data-fig="zf"] #zf-toggle, [data-fig="zf"] #zf-knob { cursor:pointer; }
  `,
  mount(stage, api) {
    /*  parts            x    y    z    w    d    h
        plate            0    0    0  380  196    8
        sheet           22   26    8  196  148  1.5
        console        258   48    8  110  112   28  -> top z=36
        toggle slot     12   12  (console top, local)  lever 13 × 10 × 7
        knob            66   68  (console top, local)  r 15, h 7  */
    const SX = 22,
      SY = 26,
      SW = 196,
      SD = 148,
      SZ = 9.5;
    const BX = 258,
      BY = 48,
      BW = 110,
      BD = 112,
      BH = 28,
      BT = 8 + BH;
    const KX = 66,
      KY = 68,
      KR = 15,
      KH = 7;

    const K = api.iso.frame([
      [0, 0, 0],
      [380, 0, 0],
      [0, 196, 0],
      [380, 196, 0],
      [BX, BY, BT + KH],
    ]);
    const { TOP, FRONT, SIDE, box } = K;

    // ground plate, inset line, screws, a printed label
    let svg = box(0, 0, 0, 380, 196, 8, 14);
    svg += `<g transform="${TOP(0, 0, 8)}"><rect class="detail" x="10" y="10" width="360" height="176" rx="8"/>
      ${[
        [18, 18],
        [362, 18],
        [18, 178],
        [362, 178],
      ]
        .map(([x, y]) => `<circle class="detail" cx="${x}" cy="${y}" r="3"/>`)
        .join("")}
      <text class="label" x="${SX}" y="${SY + SD + 12}" font-size="7" opacity=".7">grain only</text></g>`;

    // signal wire: console → under the sheet
    const WIRE = `M${BX + 12} ${BY + BD} V${BY + BD + 4} Q${BX + 12} ${BY + BD + 9} ${BX + 6} ${BY + BD + 9} H${SX + SW - 14}`;
    svg += `<g transform="${TOP(0, 0, 8)}"><path class="wire-under" d="${WIRE}"/><path id="zf-wire" class="wire" d="${WIRE}"/>
      <path id="zf-pulse" class="pulse" pathLength="1000" d="${WIRE}"/></g>`;

    // the sheet: grain dots and fibres, then the folds layer
    svg += box(SX, SY, 8, SW, SD, SZ - 8);
    const rnd = rand(7);
    const grain: [number, string][] = [];
    for (let i = 0; i < 900; i++) {
      const x = 4 + rnd() * (SW - 8);
      const y = 4 + rnd() * (SD - 8);
      const t = rnd();
      const kind = rnd();
      if (kind < 0.25) {
        const a = rnd() * Math.PI;
        const l = 2 + rnd() * 3.5;
        const dx = (Math.cos(a) * l) / 2;
        const dy = (Math.sin(a) * l) / 2;
        grain.push([
          t,
          `<line class="zf-fib" x1="${(x - dx).toFixed(1)}" y1="${(y - dy).toFixed(1)}" x2="${(x + dx).toFixed(1)}" y2="${(y + dy).toFixed(1)}" opacity="${(0.35 + rnd() * 0.3).toFixed(2)}"/>`,
        ]);
      } else {
        grain.push([
          t,
          `<circle class="zf-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.45 + rnd() * 0.6).toFixed(2)}" opacity="${(0.3 + rnd() * 0.35).toFixed(2)}"/>`,
        ]);
      }
    }
    grain.sort((a, b) => a[0] - b[0]);

    // folds: two long creases, a dog-eared corner, shaded facets, wrinkles
    const C1: [number, number, number, number] = [0, 40, SW, 114];
    const C2: [number, number, number, number] = [66, 0, 140, SD];
    // where the two long creases cross
    const k1 = (C1[3] - C1[1]) / (C1[2] - C1[0]);
    const k2 = (C2[2] - C2[0]) / (C2[3] - C2[1]);
    const ix = (C2[0] + k2 * C1[1]) / (1 - k2 * k1);
    const iy = C1[1] + k1 * ix;
    const pts = (p: number[][]) => p.map(([x, y]) => `${x},${y}`).join(" ");
    const WRINKLES = [
      [22, 96, 40, 104],
      [30, 112, 44, 126],
      [52, 128, 66, 120],
      [118, 30, 136, 38],
      [168, 84, 186, 78],
      [92, 130, 108, 140],
      [166, 126, 182, 136],
      [12, 18, 28, 12],
      [150, 60, 162, 70],
      [60, 66, 76, 58],
    ];
    svg += `<g id="zf-sheet" transform="${TOP(SX, SY, SZ)}">
      <g id="zf-grain" class="zf-grain">${grain.map(([, s]) => s).join("")}</g>
      <g id="zf-folds" class="zf-folds">
        <polygon class="zf-facet" opacity=".55" points="${pts([
          [0, 0],
          [C2[0], 0],
          [ix, iy],
          [0, C1[1]],
        ])}"/>
        <polygon class="zf-facet" opacity=".55" points="${pts([
          [ix, iy],
          [SW, C1[3]],
          [SW, SD],
          [C2[2], SD],
        ])}"/>
        <polygon class="zf-facet" opacity=".9" points="${pts([
          [150, 0],
          [SW, 0],
          [SW, 52],
        ])}"/>
        ${WRINKLES.map(([a, b, c, d]) => `<line class="zf-wrinkle" x1="${a}" y1="${b}" x2="${c}" y2="${d}"/>`).join("")}
        <line class="zf-crease" pathLength="1000" x1="${C1[0]}" y1="${C1[1]}" x2="${C1[2]}" y2="${C1[3]}"/>
        <line class="zf-crease" pathLength="1000" x1="${C2[0]}" y1="${C2[1]}" x2="${C2[2]}" y2="${C2[3]}"/>
        <line class="zf-crease" pathLength="1000" x1="150" y1="0" x2="${SW}" y2="52"/>
      </g></g>`;

    // console: display on the front, toggle and knob on the top
    svg += box(BX, BY, 8, BW, BD, BH, 6);
    svg += `<g transform="${FRONT(BX, BY + BD, BT)}">
      <rect class="face recess" x="8" y="5" width="${BW - 16}" height="${BH - 10}" rx="2"/>
      <rect id="zf-glass" class="glass" x="10" y="7" width="${BW - 20}" height="${BH - 14}" rx="1.5"/>
      <text id="zf-disp" class="scr" x="${BW / 2}" y="${BH / 2 + 2.5}" font-size="7" text-anchor="middle"></text></g>`;
    svg += `<g transform="${SIDE(BX + BW, BY + BD, BT)}">${[0, 1, 2, 3, 4].map((i) => `<line class="detail" x1="${16 + i * 5}" y1="8" x2="${16 + i * 5}" y2="${BH - 8}"/>`).join("")}</g>`;
    const a0 = Math.PI / 2;
    const ang = (v: number) => a0 + (v / MAX) * Math.PI * 1.5;
    const polar = (r: number, a: number): [number, number] => [
      KX + r * Math.cos(a),
      KY + r * Math.sin(a),
    ];
    const RA = 27;
    const [s0x, s0y] = polar(RA, a0);
    const [s1x, s1y] = polar(RA, ang(MAX));
    svg += `<g transform="${TOP(BX, BY, BT)}">
      <rect class="face recess" x="12" y="12" width="38" height="13" rx="6.5"/>
      <text class="label" x="12" y="38" font-size="8">folds</text>
      <circle id="zf-led" class="led" cx="60" cy="18.5" r="2.6"/>
      <path class="zf-arc" d="M${s0x} ${s0y}A${RA} ${RA} 0 1 1 ${s1x} ${s1y}"/>
      ${[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6]
        .map((v) => {
          const [x1, y1] = polar(RA + 3, ang(v));
          const [x2, y2] = polar(RA + (v === 0 || v === MAX ? 7 : 5.5), ang(v));
          return `<line class="detail" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
        })
        .join("")}
      <path id="zf-val" class="zf-val" d=""/>
      <text class="label" x="10" y="${KY + 30}" font-size="8">fibre</text>
      <text class="label" x="${KX - 10}" y="${KY + RA + 8}" font-size="6" opacity=".8">0</text>
      <text class="label" x="${KX + RA + 4}" y="${KY - 4}" font-size="6" opacity=".8">.6</text></g>`;
    // toggle lever, slides along the slot
    svg += `<g id="zf-toggle"><g id="zf-slide" class="zf-lever"><g id="zf-lever" class="press">${box(BX + 13, BY + 13.5, BT, 13, 10, 7, 2.5)}</g></g></g>`;
    // knob
    svg += `<g id="zf-knob"><g id="zf-cap" class="press">${box(BX + KX - KR, BY + KY - KR, BT, KR * 2, KR * 2, KH, KR)}</g>
      <g transform="${TOP(BX, BY, BT + KH)}"><circle class="detail" cx="${KX}" cy="${KY}" r="${KR - 3}"/>
      <line id="zf-ptr" class="zf-ptr" x1="${KX}" y1="${KY}" x2="${KX}" y2="${KY}"/></g></g>`;

    stage.setAttribute("viewBox", K.viewBox);
    stage.innerHTML = svg;
    const $ = (id: string) => stage.querySelector<SVGElement>("#zf-" + id)!;
    const dots = [...$("grain").children] as SVGElement[];
    const [dx, dy] = K.D(23, 0, 0);

    const st = { folds: false, fibre: 0.2 };

    function render() {
      const n = Math.round((st.fibre / MAX) * dots.length);
      dots.forEach((d, i) => {
        d.style.opacity = i < n ? "" : "0";
      });
      $("folds").classList.toggle("on", st.folds);
      $("led").classList.toggle("hot", st.folds);
      $("lever").classList.toggle("latched", st.folds);
      $("slide").style.transform = st.folds ? `translate(${dx}px, ${dy}px)` : "";
      const live = st.fibre > 0.001;
      const [ex, ey] = polar(RA, ang(st.fibre));
      $("val").setAttribute(
        "d",
        live
          ? `M${s0x} ${s0y}A${RA} ${RA} 0 ${st.fibre / MAX > 2 / 3 ? 1 : 0} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`
          : "",
      );
      const [px, py] = polar(KR - 3, ang(st.fibre));
      $("ptr").setAttribute("x2", px.toFixed(2));
      $("ptr").setAttribute("y2", py.toFixed(2));
      $("cap").classList.toggle("latched", live);
      $("wire").classList.toggle("hot", live || st.folds);
      $("glass").classList.toggle("hot", live || st.folds);
      const text = `folds ${st.folds ? 1 : 0} · fibre ${st.fibre.toFixed(2)}`;
      $("disp").textContent = text;
      api.power(live || st.folds);
      api.readout(text);
    }

    function folds() {
      st.folds = !st.folds;
      api.flash($("lever"), 160);
      api.replay($("pulse"), "go");
      if (st.folds) api.replay($("folds"), "go");
      render();
    }

    function fibre(d: number, wrap = false) {
      let v = Math.round((st.fibre + d) / STEP) * STEP;
      if (wrap && v > MAX + 1e-6) v = 0;
      st.fibre = Math.min(MAX, Math.max(0, v));
      api.flash($("cap"), 140);
      api.replay($("pulse"), "go");
      render();
    }

    $("toggle").addEventListener("click", folds);
    $("knob").addEventListener("click", () => fibre(STEP, true));
    render();
    return {
      key: (e) => {
        if (e.key === " " || e.key === "Enter") {
          folds();
          return true;
        }
        if (e.key === "ArrowUp" || e.key === "ArrowRight") {
          fibre(STEP);
          return true;
        }
        if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
          fibre(-STEP);
          return true;
        }
        return false;
      },
      demo: () => {
        api.after(200, folds);
        [1200, 1450, 1700].forEach((t) => api.after(t, () => fibre(STEP)));
        api.after(2600, folds);
      },
    };
  },
};
