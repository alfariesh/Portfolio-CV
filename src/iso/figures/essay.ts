// Note cover for "ai-native is a practice, not a title". A human's drafting
// desk and an agent's server, joined by a wire. One round: the human sketches,
// the agent builds, the human reviews. Taste, trade-offs and detail stay with
// the human; translation goes to the agent.
import type { Point3 } from "../kernel";
import type { IsoFig } from "../types";

// two sketches the human alternates between, as strokes on a 72 x 68 sheet
const SKETCHES: string[][] = [
  [
    "M7 9 H38",
    "M7 20 H65 V42 H7 Z",
    "M7 20 L65 42 M65 20 L7 42",
    "M7 50 H52 M7 56 H46 M7 62 H32",
    "M44 56 H61 Q64 56 64 59.5 Q64 63 61 63 H44 Q41 63 41 59.5 Q41 56 44 56 Z",
  ],
  [
    "M7 9 H30",
    "M28 29 A9 9 0 1 0 10 29 A9 9 0 1 0 28 29 Z",
    "M34 23 H64 M34 29 H58 M34 35 H48",
    "M7 44 H65 V64 H7 Z",
    "M11 58 L22 52 L32 56 L44 48 L60 51",
  ],
];
const KEPT = ["taste", "trade-offs", "detail"];
const BARS: [indent: number, width: number][] = [
  [0, 52],
  [6, 44],
  [12, 58],
  [12, 34],
  [6, 50],
  [0, 26],
];

export const essay: IsoFig = {
  id: "es",
  name: "Practice, not a title",
  hint: "Click the desk · space runs a round · r resets",
  aria: "Isometric drafting desk and an agent's server joined by a wire. Click the desk or press space to run one round: the human sketches on the sheet, a pulse carries it to the agent, which builds it on its terminal, and a pulse brings it back for the human to review and approve. A panel counts the decisions kept human (taste, trade-offs, detail) against the work done by the agent (translation). Press r to reset.",
  css: `
    [data-fig="es"] .glass { vector-effect:non-scaling-stroke; }
    [data-fig="es"] path.wire, [data-fig="es"] circle.led, [data-fig="es"] rect.glass { transition:none; }
    [data-fig="es"] .es-ink { fill:var(--ink-hi); font-family:var(--mono); }
    [data-fig="es"] .es-mute { fill:var(--ink); font-family:var(--mono); }
    [data-fig="es"] .es-hot { fill:var(--accent); font-family:var(--mono); }
    [data-fig="es"] .es-sk { fill:none; stroke:var(--ink-hi); stroke-width:.9; stroke-linecap:round; stroke-linejoin:round; stroke-dasharray:100 100; stroke-dashoffset:100; }
    [data-fig="es"] .es-sk.live { stroke:var(--accent); }
    [data-fig="es"] .es-check { fill:none; stroke:var(--accent); stroke-width:2.2; stroke-linecap:round; stroke-linejoin:round; vector-effect:non-scaling-stroke; opacity:0; }
    [data-fig="es"] .es-check.on { opacity:1; }
    [data-fig="es"] .es-bar { fill:var(--detail); }
    [data-fig="es"] .es-bar.on { fill:var(--accent); }
    [data-fig="es"] .es-num { fill:var(--ink); font-family:var(--mono); }
    [data-fig="es"] .es-num.on { fill:var(--accent); }
    [data-fig="es"] .press path.face, [data-fig="es"] .press rect.face { transition:none; }
    [data-fig="es"] .press.latched .detail { stroke:var(--panel); }
  `,
  mount(stage, api) {
    const K = api.iso.frame(
      [
        [0, 0, 0],
        [340, 0, 0],
        [0, 250, 0],
        [340, 250, 0],
        [176, 16, 114],
        [286, 16, 114],
        [26, 120, 74],
      ],
      0.06,
    );
    const { TOP, FRONT, SIDE, box, plane, path } = K;
    const { slits } = api.iso;
    const poly = (pts: Point3[], cls = "face") => `<path class="${cls}" d="${path(pts)}Z"/>`;

    // ground plate + screws + printed title
    let svg = box(0, 0, 0, 340, 250, 8, 14);
    svg += `<g transform="${TOP(0, 0, 8)}"><rect class="detail" x="10" y="10" width="320" height="230" rx="8"/>
      ${[
        [18, 18],
        [322, 18],
        [18, 232],
        [322, 232],
      ]
        .map(([x, y]) => `<circle class="detail" cx="${x}" cy="${y}" r="3"/>`)
        .join("")}
      <text class="label" x="40" y="238" font-size="7" opacity=".7">a practice, not a title</text></g>`;

    // the wire: desk → agent, with a pulse each way
    const WO = "M166 130 H186 Q194 130 194 122 V86";
    const WB = "M194 86 V122 Q194 130 186 130 H166";
    svg += `<g transform="${TOP(0, 0, 8)}"><path class="wire-under" d="${WO}"/><path id="es-wire" class="wire" d="${WO}"/>
      <path id="es-pout" class="pulse" pathLength="1000" d="${WO}"/><path id="es-pback" class="pulse" pathLength="1000" d="${WB}"/></g>`;

    // the agent: a server with a terminal on the front, rack units on the side
    svg += box(176, 16, 8, 110, 70, 104, 5);
    svg += `<g transform="${TOP(176, 16, 112)}">${slits(16, 94, 6, 10, 60)}</g>`;
    svg += `<g transform="${SIDE(286, 86, 112)}">${[0, 1, 2, 3, 4]
      .map((i) => {
        const v = 10 + i * 17;
        return `<rect class="face recess" x="7" y="${v}" width="56" height="13" rx="1"/>${slits(11, 41, 3, v + 2.5, v + 10.5)}
          <circle id="es-rled${i}" class="led" cx="55" cy="${v + 6.5}" r="2.3"/>`;
      })
      .join("")}</g>`;
    svg += `<g transform="${FRONT(176, 86, 112)}">
      <text class="label" x="8" y="10.5" font-size="6.5">agent</text>
      <circle id="es-aled" class="led" cx="99" cy="8" r="2.5"/>
      <rect id="es-glass" class="glass" x="8" y="15" width="94" height="66" rx="3"/>
      <text id="es-prompt" class="es-mute" x="14" y="26" font-size="6.5">› idle</text>
      ${BARS.map(([ind, w], i) => `<rect id="es-bar${i}" class="es-bar" x="${14 + ind}" y="${32 + i * 6.4}" width="${w * 1.12}" height="3" rx="1.2" opacity="0"/>`).join("")}
      <text id="es-status" class="es-mute" x="14" y="76.5" font-size="6.5"></text>
      ${slits(87, 97, 4, 12, 98, false)}</g>`;

    // the human: a drafting desk with a sloped board, a sheet, a pen, a key
    svg += `<g id="es-desk" style="cursor:pointer">`;
    svg += box(16, 112, 8, 150, 112, 30, 4);
    svg += `<g transform="${FRONT(16, 224, 38)}"><rect class="detail" x="8" y="6" width="64" height="18" rx="1.5"/><rect class="detail" x="78" y="6" width="64" height="18" rx="1.5"/>
      <rect class="detail" x="33" y="13" width="14" height="3" rx="1.5"/><rect class="detail" x="103" y="13" width="14" height="3" rx="1.5"/></g>`;
    svg += `<g transform="${SIDE(166, 224, 38)}"><text class="label" x="8" y="12.5" font-size="6.5">human</text>${slits(14, 22, 4, 52, 104, false)}</g>`;
    const bx0 = 24,
      bx1 = 132,
      yb = 120,
      yf = 214,
      zb = 74,
      zf = 44;
    const run = yf - yb;
    const rise = zb - zf;
    const L = Math.hypot(run, rise);
    const cb = run / L;
    const sb = rise / L;
    svg += poly([
      [bx1, yb, 38],
      [bx1, yf, 38],
      [bx1, yf, zf],
      [bx1, yb, zb],
    ]);
    svg += poly([
      [bx0, yf, 38],
      [bx1, yf, 38],
      [bx1, yf, zf],
      [bx0, yf, zf],
    ]);
    svg += poly(
      [
        [bx0, yb, zb],
        [bx1, yb, zb],
        [bx1, yf, zf],
        [bx0, yf, zf],
      ],
      "face top",
    );
    svg += `<g transform="${SIDE(bx1, yf, zf)}"><path class="detail" d="M5 3.5 L${run - 6} ${-rise + 8.5}"/></g>`;
    const sheet = plane([bx0 + 10, yb + 6 * cb, zb - 6 * sb], [1, 0, 0], [0, cb, -sb]);
    svg += `<g transform="${sheet}">
      <rect class="face top" width="88" height="84"/>
      <rect class="face" x="36" y="-2.5" width="16" height="7" rx="1"/>
      <g transform="scale(1.22)"><g id="es-sketch"></g>
      <path id="es-check" class="es-check" d="M64.5 10 A7.5 7.5 0 1 1 49.5 10 A7.5 7.5 0 1 1 64.5 10 Z M53 10.5 L56 13.5 L61 7"/></g></g>`;

    // pen: a hex barrel along y with a short tip
    const hex = (cx: number, cz: number, r: number): [number, number][] =>
      [0, 1, 2, 3, 4, 5].map((i) => [
        cx + r * Math.cos((i * Math.PI) / 3),
        cz + r * Math.sin((i * Math.PI) / 3),
      ]);
    const barrel = (y0: number, y1: number, h: [number, number][]) =>
      [5, 0, 1]
        .map((i) => {
          const a = h[i];
          const b = h[(i + 1) % 6];
          return poly(
            [
              [a[0], y0, a[1]],
              [a[0], y1, a[1]],
              [b[0], y1, b[1]],
              [b[0], y0, b[1]],
            ],
            i === 1 ? "face top" : "face",
          );
        })
        .join("");
    const pz = 38 + 2.8 * Math.sin(Math.PI / 3);
    const ph = hex(150, pz, 2.8);
    svg += `<g class="press" id="es-pen">${barrel(124, 168, ph)}
      ${[5, 0, 1]
        .map((i) => {
          const a = ph[i];
          const b = ph[(i + 1) % 6];
          return poly([
            [a[0], 168, a[1]],
            [b[0], 168, b[1]],
            [150, 177, pz],
          ]);
        })
        .join("")}</g>`;
    svg += `<g class="press" id="es-key">${box(141, 194, 38, 20, 16, 6, 3)}
      <g transform="${TOP(141, 194, 44)}"><path class="detail" d="M6 8.5 L9 11.5 L14.5 5"/></g></g>`;
    svg += `</g>`;

    // the tally: decisions kept human vs work done by the agent
    svg += box(208, 196, 8, 128, 24, 4, 3);
    svg += box(214, 204, 12, 116, 8, 60, 2);
    svg += `<g transform="${FRONT(214, 212, 72)}">
      <text class="label" x="6" y="11" font-size="6.5">kept human</text>
      <text id="es-nh" class="es-num" x="6" y="30" font-size="16">0</text>
      ${KEPT.map(
        (k, i) => `<circle id="es-k${i}" class="led" cx="9" cy="${39 + i * 8}" r="2.3"/>
        <text class="label" x="14" y="${41.2 + i * 8}" font-size="6">${k}</text>`,
      ).join("")}
      <line class="detail" x1="59" y1="5" x2="59" y2="56"/>
      <text class="label" x="65" y="11" font-size="6.5">by agent</text>
      <text id="es-na" class="es-num" x="65" y="30" font-size="16">0</text>
      <circle id="es-t0" class="led" cx="68" cy="39" r="2.3"/>
      <text class="label" x="73" y="41.2" font-size="6">translation</text></g>`;

    stage.setAttribute("viewBox", K.viewBox);
    stage.innerHTML = svg;
    const $ = (id: string) => stage.querySelector<SVGElement>("#es-" + id)!;
    const bars = BARS.map((_, i) => $("bar" + i));
    const rleds = [0, 1, 2, 3, 4].map((i) => $("rled" + i));
    const kept = KEPT.map((_, i) => $("k" + i));

    type Phase = "idle" | "sketch" | "send" | "build" | "return" | "review" | "done";
    const st = {
      round: 0,
      phase: "idle" as Phase,
      strokes: 0,
      ink: 0,
      bars: 0,
      kept: 0,
      human: 0,
      agent: 0,
      rack: -1,
    };
    let gen = 0;
    const later = (ms: number, fn: () => void) => {
      const g = gen;
      api.after(ms, () => {
        if (g === gen) fn();
      });
    };
    const busy = () => st.phase !== "idle" && st.phase !== "done";
    const sketch = () => SKETCHES[(st.round + 1) % 2];

    function drawSheet() {
      $("sketch").innerHTML = sketch()
        .map((d, i) => `<path class="es-sk" id="es-sk${i}" pathLength="100" d="${d}"/>`)
        .join("");
    }

    function render() {
      const strokes = [...stage.querySelectorAll<SVGElement>(".es-sk")];
      // each stroke draws itself: done, in progress (ink 0..1), or not yet
      strokes.forEach((el, i) => {
        const k = i < st.strokes - 1 ? 1 : i === st.strokes - 1 ? st.ink : 0;
        el.style.strokeDashoffset = String(100 * (1 - k));
        el.style.opacity = k > 0 ? "1" : "0";
        el.classList.toggle("live", st.phase === "sketch" && i === st.strokes - 1);
      });
      $("pen").classList.toggle("latched", st.phase === "sketch");
      $("key").classList.toggle("latched", st.phase === "review" || st.phase === "done");
      $("check").classList.toggle(
        "on",
        st.phase === "done" || (st.phase === "review" && st.kept > 0),
      );
      $("wire").classList.toggle(
        "hot",
        st.phase === "send" || st.phase === "return" || st.phase === "done",
      );
      const built = st.round > 0 && !["idle", "sketch", "send"].includes(st.phase);
      $("glass").classList.toggle("hot", built);
      $("aled").classList.toggle("hot", st.phase === "build");
      bars.forEach((b, i) => {
        b.style.opacity = built && i < st.bars ? "1" : "0";
        b.classList.toggle("on", built && i < st.bars);
      });
      rleds.forEach((l, i) => l.classList.toggle("hot", i === st.rack));
      $("prompt").textContent = built ? "› translate sketch" : st.round ? "› waiting" : "› idle";
      $("prompt").setAttribute("class", built ? "es-hot" : "es-mute");
      $("status").textContent =
        st.phase === "build" ? "building…" : built ? `built · ${st.bars} files` : "";
      kept.forEach((k, i) => k.classList.toggle("hot", i < st.kept));
      $("t0").classList.toggle("hot", built);
      $("nh").textContent = String(st.human);
      $("na").textContent = String(st.agent);
      $("nh").classList.toggle("on", st.human > 0);
      $("na").classList.toggle("on", st.agent > 0);
      api.power(st.round > 0);
      const r = `round ${st.round}`;
      api.readout(
        st.phase === "idle"
          ? "ready · space runs a round"
          : st.phase === "sketch"
            ? `${r} · human sketches`
            : st.phase === "send"
              ? `${r} · handing over`
              : st.phase === "build"
                ? `${r} · agent builds`
                : st.phase === "return"
                  ? `${r} · back for review`
                  : st.phase === "review"
                    ? `${r} · human reviews`
                    : `${r} · ${KEPT.length} decisions kept human`,
      );
    }

    function go() {
      if (busy()) return;
      st.round++;
      Object.assign(st, { phase: "sketch", strokes: 0, ink: 0, bars: 0, kept: 0 });
      drawSheet();
      render();
      const n = sketch().length;
      for (let i = 1; i <= n; i++)
        for (let k = 1; k <= 5; k++)
          later(i * 260 + k * 40 - 200, () => {
            st.strokes = i;
            st.ink = k / 5;
            render();
          });
      // hand the sketch to the agent
      const t1 = n * 260 + 320;
      later(t1, () => {
        st.phase = "send";
        api.replay($("pout"), "go");
        render();
      });
      // the agent translates it into code, line by line
      const t2 = t1 + 560;
      later(t2, () => {
        st.phase = "build";
        render();
      });
      BARS.forEach((_, i) =>
        later(t2 + 120 + i * 150, () => {
          st.bars = i + 1;
          st.rack = i % 5;
          render();
        }),
      );
      const t3 = t2 + 120 + BARS.length * 150 + 120;
      later(t3, () => {
        st.agent++;
        st.rack = -1;
        st.phase = "return";
        api.replay($("pback"), "go");
        render();
      });
      // the human reviews: taste, trade-offs, detail, then approves
      const t4 = t3 + 560;
      later(t4, () => {
        st.phase = "review";
        render();
      });
      KEPT.forEach((_, i) =>
        later(t4 + 160 + i * 200, () => {
          st.kept = i + 1;
          st.human++;
          render();
        }),
      );
      later(t4 + 160 + KEPT.length * 200, () => {
        api.flash($("key"), 200);
        st.phase = "done";
        render();
      });
    }

    function reset() {
      gen++;
      Object.assign(st, {
        round: 0,
        phase: "idle",
        strokes: 0,
        ink: 0,
        bars: 0,
        kept: 0,
        human: 0,
        agent: 0,
        rack: -1,
      });
      drawSheet();
      render();
    }

    $("desk").addEventListener("click", go);
    drawSheet();
    render();
    return {
      key: (e) => {
        if (e.key === " " || e.key === "Enter") {
          go();
          return true;
        }
        if (e.key === "r" || e.key === "R") {
          reset();
          return true;
        }
        return false;
      },
      demo: () => api.after(200, go),
    };
  },
};
