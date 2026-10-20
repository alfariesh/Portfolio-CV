// Vuboi: a community-driven wellness app, "every step shapes you". A phone on
// a stand runs the workout tracker (big targets, instant feedback mid-set), a
// rack holds the dumbbells, a drawer cabinet stands for the 540-exercise
// library, and member cards send a cheer down the wire after the last set.
import type { Point3 } from "../kernel";
import type { IsoFig } from "../types";

type Ex = { name: string; kg: number; reps: number; db: number; feel: [number, number] };

const PLAN: Ex[] = [
  { name: "bench press", kg: 12, reps: 8, db: 3, feel: [2, 4] },
  { name: "goblet squat", kg: 10, reps: 10, db: 2, feel: [3, 4] },
  { name: "one-arm row", kg: 8, reps: 10, db: 1, feel: [2, 5] },
  { name: "curl", kg: 6, reps: 12, db: 0, feel: [3, 5] },
];
const SETS = 4;
const KG = [6, 8, 10, 12];

export const vuboi: IsoFig = {
  id: "vb",
  name: "Vuboi tracker",
  hint: "Click the phone · space logs a set · r resets",
  aria: "Isometric workout tracker: a phone on a stand beside a dumbbell rack, an exercise library and three member cards. Click the phone or press space to log a set; the next set chip lights and the weight on the rack flashes. After the fourth set the phone asks how you feel and the members send a cheer along the wire. Press r to reset.",
  css: `
    [data-fig="vb"] .glass { vector-effect:non-scaling-stroke; }
    [data-fig="vb"] .vb-ink { fill:var(--ink-hi); font-family:var(--mono); }
    [data-fig="vb"] .vb-mute { fill:var(--ink); font-family:var(--mono); }
    [data-fig="vb"] .vb-hot { fill:var(--accent); font-family:var(--mono); }
    [data-fig="vb"] .vb-on { fill:var(--panel); font-family:var(--mono); }
    [data-fig="vb"] .vb-chip { fill:none; stroke:var(--detail); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="vb"] .vb-chip.cur { stroke:var(--accent); stroke-width:1.4; }
    [data-fig="vb"] .vb-dot { fill:none; stroke:var(--detail); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="vb"] .vb-btn { fill:var(--accent); transition:fill .3s; }
    [data-fig="vb"] .vb-btn.hit { fill:var(--accent-hi); transition:none; }
    [data-fig="vb"] path.wire, [data-fig="vb"] circle.led, [data-fig="vb"] rect.glass { transition:none; }
    [data-fig="vb"] .press path.face, [data-fig="vb"] .press rect.face { transition:none; }
    [data-fig="vb"] .press.latched .vb-av { stroke:var(--panel); }
    [data-fig="vb"] .press.latched .label { fill:var(--panel); }
  `,
  mount(stage, api) {
    const K = api.iso.frame([
      [0, 0, 0],
      [300, 0, 0],
      [0, 250, 0],
      [300, 250, 0],
      [80, 116, 153],
      [156, 116, 153],
      [150, 24, 66],
      [290, 24, 66],
      [14, 186, 56],
    ]);
    const { TOP, FRONT, SIDE, box, plane, path } = K;
    const { slits, esc } = api.iso;
    const poly = (pts: Point3[], cls = "face") => `<path class="${cls}" d="${path(pts)}Z"/>`;

    // ground plate, printed tagline, screws
    let svg = box(0, 0, 0, 300, 250, 8, 14);
    svg += `<g transform="${TOP(0, 0, 8)}"><rect class="detail" x="10" y="10" width="280" height="230" rx="8"/>
      ${[
        [18, 18],
        [282, 18],
        [18, 232],
        [282, 232],
      ]
        .map(([x, y]) => `<circle class="detail" cx="${x}" cy="${y}" r="3"/>`)
        .join("")}
      <text class="label" x="104" y="234" font-size="7.5" opacity=".7">every step shapes you</text></g>`;

    // wires on the plate: members → phone stand, library → phone stand
    const WC = "M206 212 H160 Q152 212 152 204 V170";
    const WL = "M80 212 H100 Q108 212 108 204 V170";
    svg += `<g transform="${TOP(0, 0, 8)}">
      <path class="wire-under" d="${WC}"/><path id="vb-wc" class="wire" d="${WC}"/>
      <path class="wire-under" d="${WL}"/><path id="vb-wl" class="wire" d="${WL}"/>
      <path id="vb-pc" class="pulse" pathLength="1000" d="${WC}"/>
      <path id="vb-pl" class="pulse" pathLength="1000" d="${WL}"/></g>`;

    // dumbbell rack: legs, front stretcher, shelf with weight labels
    const legs: [number, number][] = [
      [152, 26],
      [152, 76],
      [282, 26],
    ];
    legs.forEach(([x, y]) => (svg += box(x, y, 8, 6, 6, 30)));
    svg += box(158, 77, 14, 124, 4, 4);
    svg += box(282, 76, 8, 6, 6, 30);
    svg += box(150, 24, 38, 140, 60, 8);
    const DX = [170, 204, 240, 274];
    svg += `<g transform="${FRONT(150, 84, 46)}">
      ${DX.map((x, i) => `<text class="label" x="${x - 150}" y="6.3" font-size="6" text-anchor="middle">${KG[i]}</text>`).join("")}
      <text class="label" x="4" y="6.3" font-size="6" opacity=".6">kg</text></g>`;
    svg += `<g transform="${SIDE(290, 84, 46)}"><line class="detail" x1="4" y1="4" x2="56" y2="4"/></g>`;

    // hex dumbbells along y: back head, handle, front head (cap faces front)
    const hex = (cx: number, cz: number, r: number): [number, number][] =>
      [0, 1, 2, 3, 4, 5].map((i) => [
        cx + r * Math.cos((i * Math.PI) / 3),
        cz + r * Math.sin((i * Math.PI) / 3),
      ]);
    const head = (y0: number, y1: number, h: [number, number][]) => {
      let s = "";
      [5, 0, 1].forEach((i) => {
        const a = h[i];
        const b = h[(i + 1) % 6];
        s += poly(
          [
            [a[0], y0, a[1]],
            [a[0], y1, a[1]],
            [b[0], y1, b[1]],
            [b[0], y0, b[1]],
          ],
          i === 1 ? "face top" : "face",
        );
      });
      s += poly(h.map(([x, z]): Point3 => [x, y1, z]));
      return s;
    };
    const R = [7, 8, 9, 10];
    DX.forEach((cx, i) => {
      const r = R[i];
      const cz = 46 + r * Math.sin(Math.PI / 3);
      const y0 = 54 - 19;
      svg += `<g class="press" id="vb-db${i}">${head(y0, y0 + 8, hex(cx, cz, r))}
        ${box(cx - 2, y0 + 8, cz - 2, 4, 22, 4)}
        ${head(y0 + 30, y0 + 38, hex(cx, cz, r))}
        ${poly(
          hex(cx, cz, r * 0.5).map(([x, z]): Point3 => [x, y0 + 38, z]),
          "detail",
        )}</g>`;
    });

    // phone stand: base, the tilted phone (side, top, face), front lip
    const A = (14 * Math.PI) / 180;
    const sa = Math.sin(A);
    const ca = Math.cos(A);
    const PX = 80,
      PW = 76,
      PH = 136,
      PT = 7;
    const YT = 158 - PH * sa,
      ZT = 19 + PH * ca;
    svg += box(66, 116, 8, 104, 54, 12, 8);
    svg += `<g transform="${TOP(66, 116, 20)}"><rect class="detail" x="10" y="8" width="84" height="20" rx="3"/></g>`;
    svg += `<g class="press" id="vb-phone">
      <g transform="${plane([PX + PW, YT, ZT], [0, -ca, -sa], [0, sa, -ca])}"><rect class="face" width="${PT}" height="${PH}"/></g>
      <g transform="${plane([PX, YT, ZT], [1, 0, 0], [0, -ca, -sa])}"><rect class="face top" width="${PW}" height="${PT}"/></g>
      <g transform="${plane([PX, YT, ZT], [1, 0, 0], [0, sa, -ca])}">
        <rect class="face" width="${PW}" height="${PH}"/>
        <clipPath id="vb-clip"><rect x="6" y="10" width="64" height="104" rx="5"/></clipPath>
        <rect class="detail" x="30" y="4" width="16" height="2" rx="1"/>
        <rect id="vb-glass" class="glass" x="6" y="10" width="64" height="104" rx="5"/>
        <g id="vb-scr" clip-path="url(#vb-clip)"></g></g></g>`;
    svg += box(74, 158, 20, 88, 7, 9);
    svg += `<g transform="${FRONT(74, 165, 29)}"><line class="detail" x1="6" y1="4.5" x2="82" y2="4.5"/></g>`;

    // exercise library: three drawers, one filter each, with LEDs
    svg += box(14, 186, 8, 66, 50, 46, 4);
    svg += `<g transform="${TOP(14, 186, 54)}">
      <text class="label" x="8" y="23" font-size="13">540</text>
      <text class="label" x="8" y="33" font-size="6" opacity=".75">exercises</text>
      ${slits(42, 58, 4, 10, 40)}</g>`;
    const TAGS = ["equipment", "body part", "level"];
    svg += `<g transform="${FRONT(14, 236, 54)}">${TAGS.map((t, i) => {
      const y = 5 + i * 13.5;
      return `<rect class="face recess" x="4" y="${y}" width="58" height="11" rx="1.5"/>
        <text class="label" x="8" y="${y + 7.6}" font-size="6">${t}</text>
        <circle id="vb-tag${i}" class="led" cx="55" cy="${y + 5.5}" r="2.2"/>`;
    }).join("")}</g>`;
    svg += `<g transform="${SIDE(80, 236, 54)}">${slits(8, 38, 10, 6, 42, false)}</g>`;

    // member cards in a holder: the community that cheers you on
    svg += box(206, 199, 8, 92, 26, 10, 5);
    svg += `<g transform="${FRONT(206, 225, 18)}"><text class="label" x="46" y="7" font-size="6" text-anchor="middle" opacity=".75">community</text></g>`;
    const CARDS: [number, number, string][] = [
      [266, 203, "ana"],
      [238, 208, "rio"],
      [210, 213, "coach"],
    ];
    svg += CARDS.map(
      ([x, y, who], i) => `<g class="press" id="vb-card${2 - i}">${box(x, y, 18, 26, 3, 46)}
        <g transform="${FRONT(x, y + 3, 64)}">
          <circle class="detail vb-av" cx="13" cy="13" r="5.5"/>
          <path class="detail vb-av" d="M4.5 30 Q4.5 21.5 13 21.5 Q21.5 21.5 21.5 30"/>
          <text class="label" x="13" y="40" font-size="6" text-anchor="middle">${who}</text></g></g>`,
    ).join("");

    stage.setAttribute("viewBox", K.viewBox);
    stage.innerHTML = svg;
    const $ = (id: string) => stage.querySelector<SVGElement>("#vb-" + id)!;
    const dbs = KG.map((_, i) => $("db" + i));
    const cards = [0, 1, 2].map((i) => $("card" + i));
    const tags = [0, 1, 2].map((i) => $("tag" + i));
    const scr = $("scr");

    const st = {
      ex: 0,
      set: 0,
      phase: "sets" as "sets" | "feel" | "done",
      after: 0,
      cheers: 0,
      hit: false,
      tags: 0,
      busy: false,
      on: false,
    };
    const ex = () => PLAN[st.ex];
    // timers from a run that r has reset are dropped
    let gen = 0;
    const later = (ms: number, fn: () => void) => {
      const g = gen;
      api.after(ms, () => {
        if (g === gen) fn();
      });
    };

    const T = (x: number, y: number, size: number, s: string, cls = "vb-ink", anchor = "start") =>
      `<text class="${cls}" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${esc(s)}</text>`;
    const button = (label: string, size: number) =>
      `<rect class="vb-btn${st.hit ? " hit" : ""}" x="10" y="80" width="56" height="27" rx="5"/>
        ${T(38, 93.5 + size * 0.35, size, label, "vb-on", "middle")}`;

    function screen() {
      const e = ex();
      let s = "";
      if (st.phase === "sets") {
        s += T(11, 21, 6, `${st.set}/${SETS} sets`, "vb-mute");
        s += T(65, 21, 6, `${e.kg} kg`, "vb-mute", "end");
        s += T(11, 32, 7.5, e.name);
        for (let i = 0; i < SETS; i++) {
          const x = 10 + i * 14.5;
          const done = i < st.set;
          const cur = i === st.set;
          s += done
            ? `<rect class="scr-accent" x="${x}" y="39" width="12.5" height="19" rx="2"/>`
            : `<rect class="vb-chip${cur ? " cur" : ""}" x="${x}" y="39" width="12.5" height="19" rx="2"/>`;
          s += T(
            x + 6.25,
            51,
            7,
            String(i + 1),
            done ? "vb-on" : cur ? "vb-hot" : "vb-mute",
            "middle",
          );
        }
        s +=
          st.set === 0
            ? T(11, 70, 6, `${e.reps} reps · ready`, "vb-mute")
            : T(11, 70, 6, `✓ set ${st.set} · ${e.reps} reps`, "vb-hot");
        s += button("log set", 9);
      } else {
        const [before, after] = e.feel;
        s += T(11, 21, 6, "how do you feel?");
        [
          ["before", before, "vb-ink"],
          ["after", st.after, "scr-accent"],
        ].forEach(([label, n, cls], row) => {
          const y = 33 + row * 11;
          s += T(11, y, 6, String(label), "vb-mute");
          for (let i = 0; i < 5; i++)
            s +=
              i < Number(n)
                ? `<circle class="${cls}" cx="${40 + i * 6}" cy="${y - 2}" r="2.3"/>`
                : `<circle class="vb-dot" cx="${40 + i * 6}" cy="${y - 2}" r="2.3"/>`;
        });
        if (st.after >= after) s += T(38, 62, 8.5, "felt better", "vb-hot", "middle");
        if (st.cheers) {
          s += [0, 1, 2]
            .map((i) => `<circle class="scr-accent" cx="${14 + i * 5}" cy="71.5" r="2.4"/>`)
            .join("");
          s += T(30, 73.5, 6, `+${st.cheers} cheers`, "vb-hot");
        }
        s += button("next", 9);
      }
      return s;
    }

    function render() {
      const e = ex();
      dbs.forEach((d, i) => d.classList.toggle("latched", st.on && i === e.db));
      cards.forEach((c, i) => c.classList.toggle("latched", st.cheers > i));
      tags.forEach((t, i) => t.classList.toggle("hot", st.on && i < st.tags));
      $("glass").classList.toggle("hot", st.on);
      $("wc").classList.toggle("hot", st.cheers > 0);
      $("wl").classList.toggle("hot", st.on && st.tags === 3);
      scr.innerHTML = screen();
      api.power(st.on);
      api.readout(
        !st.on
          ? `ready · ${e.name} · 0/${SETS}`
          : st.phase === "sets"
            ? st.set
              ? `set ${st.set}/${SETS} · ${e.name}`
              : `next · ${e.name} · 0/${SETS}`
            : st.phase === "feel"
              ? `${e.name} done · how do you feel?`
              : `done · felt better · ${st.cheers} cheers`,
      );
    }

    // the planner pulls the exercise from the library: three filters light
    function lookup() {
      st.tags = 0;
      [0, 1, 2].forEach((i) =>
        later(90 * i, () => {
          st.tags = i + 1;
          render();
        }),
      );
      later(200, () => api.replay($("pl"), "go"));
    }

    function hit() {
      st.hit = true;
      later(160, () => {
        st.hit = false;
        render();
      });
    }

    function finish() {
      st.busy = true;
      later(450, () => {
        st.phase = "feel";
        st.after = 0;
        render();
        const target = ex().feel[1];
        for (let i = 1; i <= target; i++)
          later(130 * i, () => {
            st.after = i;
            render();
          });
        // the members cheer, back card first, then the pulse reaches the phone
        const t0 = 130 * target + 300;
        [0, 1, 2].forEach((i) =>
          later(t0 + i * 140, () => {
            st.cheers = i + 1;
            if (i === 2) api.replay($("pc"), "go");
            render();
          }),
        );
        later(t0 + 280 + 560, () => {
          st.phase = "done";
          st.busy = false;
          render();
        });
      });
    }

    function next() {
      if (st.busy) return;
      if (st.phase !== "sets") {
        Object.assign(st, {
          ex: (st.ex + 1) % PLAN.length,
          set: 0,
          phase: "sets",
          after: 0,
          cheers: 0,
        });
        lookup();
        render();
        return;
      }
      if (!st.on) {
        st.on = true;
        lookup();
      }
      st.set++;
      hit();
      api.flash(dbs[ex().db], 260);
      if (st.set === SETS) finish();
      render();
    }

    function reset() {
      gen++;
      Object.assign(st, {
        ex: 0,
        set: 0,
        phase: "sets",
        after: 0,
        cheers: 0,
        tags: 0,
        busy: false,
        on: false,
      });
      render();
    }

    $("phone").addEventListener("click", next);
    render();
    return {
      key: (e) => {
        if (e.key === " " || e.key === "Enter") {
          next();
          return true;
        }
        if (e.key === "r" || e.key === "R") {
          reset();
          return true;
        }
        return false;
      },
      demo: () => [200, 750, 1300, 1850].forEach((t) => api.after(t, next)),
    };
  },
};
