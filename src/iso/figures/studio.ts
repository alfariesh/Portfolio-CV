// Studio: a desk pinboard of short notes (experiments, workflows, essays,
// demos). Pinning a note drops a card onto the board, lights its pin, ticks
// the counter and switches the desk lamp on.
import type { Point3 } from "../kernel";
import type { IsoFig } from "../types";

type V3 = Point3;

const TAGS = ["experiment", "workflow", "essay", "demo"] as const;
// The real notes, oldest first; after these the tags cycle.
const HISTORY = [0, 1, 2, 1, 3];
const SLOTS = 6;
const DROP = 420;
const TILT = [-2.5, 2, -1.5, 2.5, -2, 1.5];

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const unit = (a: V3): V3 => mul(a, 1 / Math.hypot(...a));
const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

// Convex hull of screen points (monotone chain).
function hull(pts: [number, number][]) {
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const turn = (o: number[], a: number[], b: number[]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: [number, number][] = [];
  const hi: [number, number][] = [];
  for (const q of p) {
    while (lo.length > 1 && turn(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop();
    lo.push(q);
  }
  for (const q of p.slice().reverse()) {
    while (hi.length > 1 && turn(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop();
    hi.push(q);
  }
  return [...lo.slice(0, -1), ...hi.slice(0, -1)];
}

const poly = (pts: [number, number][]) =>
  `M${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join("L")}Z`;

export const studio: IsoFig = {
  id: "st",
  name: "Studio",
  hint: "click the board · space pins a note · l lamp",
  aria: "Isometric studio desk with a pinboard of note cards, a stack of sheets, a desk lamp and a note counter. Click the board or press space to pin a new note: the card drops in, its pin lights, the counter ticks and the lamp switches on. Each card carries a tab for its tag: experiment, workflow, essay or demo. Click the lamp or press l to switch it.",
  css: `
    [data-fig="st"] .st-card { fill:var(--deck); stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="st"] .st-card.hot { stroke:var(--accent); }
    [data-fig="st"] .st-tab { fill:var(--body); stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="st"] .st-tab.hot { fill:var(--accent); stroke:var(--accent); }
    [data-fig="st"] .st-pin { fill:var(--detail); stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="st"] .st-pin.hot { fill:var(--accent); stroke:var(--accent); }
    [data-fig="st"] .st-page { fill:var(--deck); stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; transition:fill .3s, stroke .3s; }
    [data-fig="st"] .st-page.hot { fill:var(--glass-on); stroke:var(--accent); }
    [data-fig="st"] .st-mouth { fill:var(--recess); stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; transition:fill .3s; }
    [data-fig="st"] .st-mouth.hot { fill:var(--accent-hi); stroke:var(--accent); }
    [data-fig="st"] .st-bulb { fill:var(--detail); stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="st"] .st-bulb.hot { fill:var(--accent); stroke:var(--accent); }
    [data-fig="st"] .st-num { fill:var(--ink-hi); transition:fill .2s; }
    [data-fig="st"] .st-num.hot { fill:var(--accent); }
    [data-fig="st"] #st-board, [data-fig="st"] #st-lamp, [data-fig="st"] #st-stack { cursor:pointer; }
  `,
  mount(stage, api) {
    /*  parts            x    y    z    w    d    h
        plate            0    0    0  360  196    8
        board feet     118    6    8   36   34    6   (and 294)
        board          104   18   14  240   10  128  -> front y=28, top z=142
        sheets          92   96    8   90   60  ~10
        pin tin         37  153    8   26   26    8
        lamp base       24  104    8   32   32    7
        counter        226  128    8   72   26   26   wedge, slanted front  */
    const BX = 104,
      BY = 18,
      BW = 240,
      BD = 10,
      BZ = 14,
      BH = 128;
    const SX = 92,
      SY = 96,
      SW = 90,
      SD = 60;
    const LX = 40,
      LY = 120;
    const NX = 226,
      NY = 128,
      NW = 72,
      ND = 26,
      NH = 26;

    // lamp: base pivot → elbow → shade, aimed at the sheets
    const pivot: V3 = [LX, LY, 17];
    const elbow: V3 = [LX - 12, LY - 24, 128];
    const apex: V3 = [LX + 10, LY - 54, 112];
    const target: V3 = [SX + SW / 2, SY + SD / 2, 18];
    const axis = unit(add(target, mul(apex, -1)));
    const mouthC = add(apex, mul(axis, 30));

    const K = api.iso.frame([
      [0, 0, 0],
      [360, 0, 0],
      [0, 196, 0],
      [360, 196, 0],
      [BX, BY, BZ + BH],
      [BX + BW, BY, BZ + BH],
      add(elbow, [0, 0, 8]),
      mouthC,
    ]);
    const { P, TOP, FRONT, SIDE, plane, box } = K;
    const { slits, esc } = api.iso;

    // ground plate, inset line, screws, a printed label
    let svg = box(0, 0, 0, 360, 196, 8, 14);
    svg += `<g transform="${TOP(0, 0, 8)}"><rect class="detail" x="10" y="10" width="340" height="176" rx="8"/>
      ${[
        [18, 18],
        [342, 18],
        [18, 178],
        [342, 178],
      ]
        .map(([x, y]) => `<circle class="detail" cx="${x}" cy="${y}" r="3"/>`)
        .join("")}
      <text class="label" x="240" y="174" font-size="7" opacity=".7">studio · notes</text></g>`;

    // pinboard: two feet, the board, a cork field with the cards
    svg += box(BX + 14, BY - 12, 8, 36, 34, 6, 3);
    svg += box(BX + BW - 50, BY - 12, 8, 36, 34, 6, 3);
    svg += `<g id="st-board">${box(BX, BY, BZ, BW, BD, BH)}
      <g transform="${FRONT(BX, BY + BD, BZ + BH)}">
        <rect class="face recess" x="8" y="8" width="${BW - 16}" height="${BH - 16}" rx="1"/>
        ${[
          [30, 66],
          [128, 64],
          [212, 120],
          [236, 64],
          [96, 122],
        ]
          .map(([x, y]) => `<circle class="detail" cx="${x}" cy="${y}" r=".8"/>`)
          .join("")}
        <g id="st-cards"></g></g>
      <g transform="${TOP(BX, BY, BZ + BH)}">${slits(12, BW - 12, 22, 3, 7)}</g></g>`;

    // stack of sheets; the top page lights under the lamp
    const SHEETS: [number, number][] = [
      [2, -2],
      [-3, 2],
      [3, 1],
      [0, 0],
    ];
    svg += `<g id="st-stack" class="press">`;
    SHEETS.forEach(([dx, dy], i) => {
      svg += box(SX + dx, SY + dy, 8 + i * 2.5, SW, SD, 2.5);
    });
    const ST = 8 + SHEETS.length * 2.5;
    svg += `<g transform="${TOP(SX, SY, ST)}">
      <rect id="st-page" class="st-page" width="${SW}" height="${SD}"/>
      <line class="detail" x1="14" y1="6" x2="14" y2="${SD - 6}"/>
      ${slits(12, SD - 18, 8, 20, SW - 10, false)}
      <text class="label" x="20" y="${SD - 7}" font-size="7" opacity=".8">new note</text></g></g>`;
    // counter: a small wedge label on the desk, slanted face to the viewer
    const slant = Math.hypot(ND - 9, NH);
    svg += `<g transform="${SIDE(NX + NW, NY + ND, 8 + NH)}"><path class="face" d="M0 ${NH}L${ND - 9} 0H${ND}V${NH}Z"/></g>`;
    svg += `<g transform="${plane([NX, NY + 9, 8 + NH], [1, 0, 0], [0, (ND - 9) / slant, -NH / slant])}">
      <rect class="face" width="${NW}" height="${slant}"/>
      <rect id="st-win" class="glass" x="6" y="5" width="${NW - 12}" height="${slant - 10}" rx="2"/>
      <text id="st-num" class="st-num" x="${NW / 2 - 3}" y="${slant / 2 + 6}" font-size="16" text-anchor="end">0</text>
      <text class="label" x="${NW / 2 + 1}" y="${slant / 2 + 4}" font-size="8">notes</text></g>`;
    svg += `<g transform="${TOP(NX, NY, 8 + NH)}"><rect class="face top" width="${NW}" height="9"/></g>`;

    // a tin of push pins at the front of the desk
    const TX = 50,
      TY = 166;
    svg += box(TX - 13, TY - 13, 8, 26, 26, 8, 13);
    svg += `<g transform="${TOP(TX - 13, TY - 13, 16)}"><circle class="face recess" cx="13" cy="13" r="10"/>
      ${[
        [9, 9],
        [16, 8],
        [13, 14],
        [7, 16],
        [18, 16],
      ]
        .map(([x, y]) => `<circle class="st-pin" cx="${x}" cy="${y}" r="2.2"/>`)
        .join("")}</g>`;

    // desk lamp: weighted base, two-part arm, shade aimed at the sheets
    svg += `<g id="st-lamp">${box(LX - 16, LY - 16, 8, 32, 32, 7, 16)}`;
    svg += `<g transform="${TOP(LX - 16, LY - 16, 15)}"><circle class="detail" cx="16" cy="16" r="11"/>
      <circle id="st-led" class="led" cx="16" cy="27" r="2.2"/></g>`;
    const rod = (a: V3, b: V3, w = 2.6) => {
      const [ax, ay] = P(...a);
      const [bx, by] = P(...b);
      const l = Math.hypot(bx - ax, by - ay);
      const nx = (-(by - ay) / l) * w;
      const ny = ((bx - ax) / l) * w;
      return `<path class="face" d="${poly([
        [ax + nx, ay + ny],
        [bx + nx, by + ny],
        [bx - nx, by - ny],
        [ax - nx, ay - ny],
      ])}"/>`;
    };
    const joint = (p: V3, r = 4.2) => {
      const [x, y] = P(...p);
      return `<circle class="face" cx="${x}" cy="${y}" r="${r}"/><circle class="detail" cx="${x}" cy="${y}" r="1.4"/>`;
    };
    // twin rods on the lower arm, a single rod above the elbow
    svg +=
      rod(add(pivot, [-6, 2, 0]), add(elbow, [-6, 2, 0]), 1.6) + joint(add(elbow, [-6, 2, 0]), 2.4);
    svg += rod(pivot, elbow) + joint(pivot, 3.6);
    svg += rod(elbow, apex) + joint(elbow);
    // shade: hull of its two rims; the mouth faces the viewer
    const u = unit(cross(axis, [0, 0, 1]));
    const v = cross(axis, u);
    const ring = (c: V3, r: number, n = 36) =>
      Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        return P(...add(c, add(mul(u, r * Math.cos(a)), mul(v, r * Math.sin(a)))));
      });
    const back = ring(apex, 9);
    const mouth = ring(mouthC, 27);
    svg += `<path class="face" d="${poly(hull([...back, ...mouth]))}"/>`;
    svg += `<path id="st-mouth" class="st-mouth" d="${poly(mouth)}"/>`;
    svg += `<path id="st-bulb" class="st-bulb" d="${poly(ring(add(mouthC, mul(axis, -7)), 11))}"/>`;
    svg += joint(apex, 3.4);
    svg += `</g>`;

    stage.setAttribute("viewBox", K.viewBox);
    stage.innerHTML = svg;
    const $ = (id: string) => stage.querySelector<SVGElement>("#st-" + id)!;
    const cards = $("cards");

    const st = {
      cards: HISTORY.slice(0, 3),
      n: 3,
      lamp: false,
      drop: -1, // slot index still falling, or -1
      tick: false,
    };
    const tagOf = (n: number) => (n < HISTORY.length ? HISTORY[n] : (n - HISTORY.length) % 4);

    // card slots on the cork field (face-local), 3 × 2
    const CW = 62,
      CH = 40;
    const GX = (BW - 16 - 3 * CW) / 4,
      GY = (BH - 16 - 2 * CH) / 3;
    const slot = (i: number): [number, number] => {
      const c = i % 3,
        r = Math.floor(i / 3);
      return [8 + GX + c * (CW + GX) + CW / 2, 8 + GY + 2 + r * (CH + GY)];
    };

    function card(i: number, tag: number, latest: boolean) {
      const [x, y] = slot(i);
      const hot = latest && st.drop < 0 ? " hot" : "";
      const lines = [42, 28, 36];
      const hide = i === st.drop ? ` style="opacity:0"` : "";
      return `<g id="st-c${i}"${hide}><g transform="translate(${x} ${y}) rotate(${TILT[i]} 0 6)">
        <rect class="st-tab${hot}" x="${-CW / 2 + 4 + tag * 14}" y="-6" width="12" height="8" rx="1"/>
        <rect class="st-card${hot}" x="${-CW / 2}" y="0" width="${CW}" height="${CH}" rx="1"/>
        ${lines.map((w, k) => `<line class="detail" x1="${-CW / 2 + 6}" y1="${13 + k * 5.5}" x2="${-CW / 2 + 6 + w}" y2="${13 + k * 5.5}"/>`).join("")}
        <text class="label" x="${-CW / 2 + 6}" y="${CH - 5}" font-size="7.5">${esc(TAGS[tag])}</text>
        <circle class="st-pin${hot}" cx="0" cy="6" r="3"/></g></g>`;
    }

    function render() {
      cards.innerHTML = st.cards.map((tag, i) => card(i, tag, i === st.cards.length - 1)).join("");
      $("num").textContent = String(st.n);
      $("num").classList.toggle("hot", st.tick);
      $("win").classList.toggle("hot", st.lamp);
      ["mouth", "bulb", "page", "led"].forEach((id) => $(id).classList.toggle("hot", st.lamp));
      api.power(st.lamp);
      const latest = TAGS[st.cards[st.cards.length - 1]];
      api.readout(`${st.n} notes · latest: ${latest}${st.lamp ? "" : " · lamp off"}`);
    }

    function land() {
      st.drop = -1;
      st.n++;
      st.tick = true;
      st.lamp = true;
      render();
      api.after(300, () => {
        st.tick = false;
        render();
      });
    }

    function pin() {
      if (st.drop >= 0) return;
      if (st.cards.length === SLOTS) st.cards.shift();
      st.cards.push(tagOf(st.n));
      st.drop = st.cards.length - 1;
      api.flash($("stack"), 220);
      render();
      const t0 = performance.now();
      const stop = api.loop((t) => {
        const k = Math.min(1, (t - t0) / DROP);
        const el = $("c" + st.drop);
        // fall, then settle with a small bounce
        const e = k < 0.75 ? (k / 0.75) ** 2 : 1 - Math.sin(((k - 0.75) / 0.25) * Math.PI) * 0.06;
        el.setAttribute("transform", `translate(0 ${(-36 * (1 - e)).toFixed(2)})`);
        el.style.opacity = String(Math.min(1, k * 3));
        if (k >= 1) stop();
      });
      api.after(DROP, () => {
        stop();
        land();
      });
    }

    function lamp() {
      st.lamp = !st.lamp;
      render();
    }

    $("board").addEventListener("click", pin);
    $("stack").addEventListener("click", pin);
    $("lamp").addEventListener("click", lamp);
    render();
    return {
      key: (e) => {
        if (e.key === " " || e.key === "Enter") {
          pin();
          return true;
        }
        if (e.key === "l" || e.key === "L") {
          lamp();
          return true;
        }
        return false;
      },
      demo: () => [200, 1000].forEach((t) => api.after(t, pin)),
    };
  },
};
