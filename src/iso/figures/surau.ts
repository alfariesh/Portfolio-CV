// Surau: an Islamic wiki built on classical texts, with one rule: never let
// someone believe an answer they can't verify. Every answer hands the reader
// the page (heading, page number, verbatim quote, link to the source), and a
// question the books don't cover is refused: "not in the source".
import type { Point3 } from "../kernel";
import type { IsoFig } from "../types";

type Q = { q: string; head: string; book: number; page: number };

// book -1: nothing in the shelf answers it, so nothing lights
const QS: Q[] = [
  { q: "how is wudu done?", head: "purification", book: 0, page: 12 },
  { q: "ruling on e-wallets?", head: "", book: -1, page: 0 },
  { q: "what breaks a fast?", head: "fasting", book: 3, page: 214 },
  { q: "who receives zakat?", head: "zakat", book: 5, page: 88 },
];
const STAGES = ["draft", "review", "publish"];

export const surau: IsoFig = {
  id: "su",
  name: "Surau citations",
  hint: "Click the screen · space asks the next question · r resets",
  aria: "Isometric reading corner: a shelf of seven classical books, a low reading stand with an open book, and a terminal that answers questions with the page it came from. Click the terminal or press space to ask the next question; a cited answer lights its book along the wire and opens it at the page, while a question the books do not cover is refused with not in the source. Press r to reset.",
  css: `
    [data-fig="su"] .glass { vector-effect:non-scaling-stroke; }
    [data-fig="su"] .su-ink { fill:var(--ink-hi); font-family:var(--mono); }
    [data-fig="su"] .su-mute { fill:var(--ink); font-family:var(--mono); }
    [data-fig="su"] .su-hot { fill:var(--accent); font-family:var(--mono); }
    [data-fig="su"] .su-on { fill:var(--panel); font-family:var(--mono); }
    [data-fig="su"] .su-tag { fill:var(--ink); }
    [data-fig="su"] .su-card { fill:var(--deck); stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="su"] .su-card.on { stroke:var(--accent); stroke-width:1.4; }
    [data-fig="su"] .su-card.off { fill:none; stroke:var(--line); stroke-dasharray:3 2; }
    [data-fig="su"] .su-ql { fill:none; stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="su"] .su-band { fill:none; transition:fill .3s; }
    [data-fig="su"] .su-band.on { fill:var(--accent-hi); }
    [data-fig="su"] .su-band.on ~ .su-ql { stroke:var(--accent); }
    [data-fig="su"] .su-pg { fill:var(--ink); font-family:var(--mono); }
    [data-fig="su"] .su-pg.on { fill:var(--accent); }
    [data-fig="su"] .su-link { stroke:var(--accent); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="su"] circle.led, [data-fig="su"] rect.glass { transition:none; }
    [data-fig="su"] .press path.face, [data-fig="su"] .press rect.face { transition:none; }
    [data-fig="su"] .press.latched .label { fill:var(--panel); }
    [data-fig="su"] .press.latched .detail { stroke:var(--panel); }
  `,
  mount(stage, api) {
    const K = api.iso.frame([
      [0, 0, 0],
      [300, 0, 0],
      [0, 236, 0],
      [300, 236, 0],
      [20, 34, 88],
      [20, 92, 100],
      [156, 40, 114],
      [280, 40, 114],
    ]);
    const { TOP, FRONT, SIDE, box, plane, path } = K;
    const { slits, esc } = api.iso;
    const poly = (pts: Point3[], cls = "face") => `<path class="${cls}" d="${path(pts)}Z"/>`;
    const mix = (p: Point3, q: Point3, t: number): Point3 => [
      p[0] + (q[0] - p[0]) * t,
      p[1] + (q[1] - p[1]) * t,
      p[2] + (q[2] - p[2]) * t,
    ];
    // 3D polyline with rounded corners (a wire crossing several planes)
    const route = (pts: Point3[], r = 6) => {
      const out: Point3[] = [pts[0]];
      for (let i = 1; i < pts.length - 1; i++) {
        const [a, b, c] = [pts[i - 1], pts[i], pts[i + 1]];
        const la = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
        const lc = Math.hypot(c[0] - b[0], c[1] - b[1], c[2] - b[2]);
        const p0 = mix(b, a, Math.min(r, la / 2) / la);
        const p1 = mix(b, c, Math.min(r, lc / 2) / lc);
        for (let j = 0; j <= 6; j++) out.push(mix(mix(p0, b, j / 6), mix(b, p1, j / 6), j / 6));
      }
      out.push(pts[pts.length - 1]);
      return path(out);
    };

    // ground plate, screws, printed rule
    let svg = box(0, 0, 0, 300, 236, 8, 14);
    svg += `<g transform="${TOP(0, 0, 8)}"><rect class="detail" x="10" y="10" width="280" height="216" rx="8"/>
      ${[
        [18, 18],
        [282, 18],
        [18, 218],
        [282, 218],
      ]
        .map(([x, y]) => `<circle class="detail" cx="${x}" cy="${y}" r="3"/>`)
        .join("")}
      <text class="label" x="22" y="214" font-size="7" opacity=".7">cite or refuse</text></g>`;

    // books on the shelf: spines face +x, thickness along y
    const T = [17, 21, 15, 23, 18, 16, 20];
    const H = [64, 72, 58, 76, 66, 60, 70];
    const BY: number[] = [];
    T.reduce((y, t) => {
      BY.push(y);
      return y + t + 1.5;
    }, 34);
    const mid = (i: number) => BY[i] + T[i] / 2;

    // the wire: terminal → across the back → up the plinth → bus on the ledge
    const trunk = (y: number): Point3[] => [
      [156, 60, 8],
      [90, 60, 8],
      [90, 60, 22],
      [80, 60, 22],
      [80, y, 22],
      [64, y, 22],
    ];
    svg += box(14, 22, 8, 76, 166, 14, 4);
    const base =
      route(trunk(60).slice(0, 4)) +
      path([
        [80, mid(0), 22],
        [80, mid(6), 22],
      ]);
    svg += `<path class="wire-under" d="${base}"/><path class="wire" d="${base}"/>
      ${T.map((_, i) => {
        const [x, y] = K.P(80, mid(i), 22);
        return `<circle class="detail" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.6"/>`;
      }).join("")}
      <path id="su-whot" class="wire hot" d="" style="opacity:0"/>
      <path id="su-pulse" class="pulse" pathLength="1000" d="${route(trunk(mid(3)))}"/>`;

    svg += box(18, 28, 22, 44, 4, 46);
    T.forEach((t, i) => {
      const h = H[i];
      const y = BY[i];
      svg += `<g class="press" id="su-book${i}">${box(20, y, 22, 44, t, h)}
        <g transform="${TOP(20, y, 22 + h)}"><rect class="detail" x="3" y="2" width="38" height="${t - 4}" rx="1"/></g>
        <g transform="${SIDE(64, y + t, 22 + h)}">
          ${[6, 9, h - 9, h - 6].map((v) => `<line class="detail" x1="2" y1="${v}" x2="${t - 2}" y2="${v}"/>`).join("")}
          <rect class="detail" x="3" y="16" width="${t - 6}" height="${h - 32}" rx="1"/>
          <text class="label" transform="translate(${t / 2 + 2.2} ${h / 2}) rotate(-90)" font-size="6" text-anchor="middle">kitab ${i + 1}</text></g></g>`;
    });
    const endY = BY[6] + T[6] + 1.5;
    svg += box(18, endY, 22, 44, 4, 46);

    // terminal: question, answer card with its citation, editorial LEDs
    svg += `<g id="su-term" style="cursor:pointer">${box(156, 40, 8, 124, 40, 104, 5)}
      <g transform="${TOP(156, 40, 112)}">${slits(20, 104, 6, 10, 30)}</g>
      <g transform="${SIDE(280, 80, 112)}">${slits(6, 34, 7, 14, 30)}${slits(6, 34, 7, 72, 88)}</g>
      <g transform="${FRONT(156, 80, 112)}">
      <clipPath id="su-clip"><rect x="8" y="8" width="108" height="70" rx="3"/></clipPath>
      <rect id="su-glass" class="glass" x="8" y="8" width="108" height="70" rx="3"/>
      <g id="su-scr" clip-path="url(#su-clip)"></g>
      ${STAGES.map((s, i) => {
        const x = [13, 49, 86][i];
        return `<circle id="su-led${i}" class="led" cx="${x}" cy="91" r="2.6"/>
          <text class="label" x="${x + 5}" y="93.2" font-size="6">${s}</text>`;
      }).join("")}</g></g>`;

    // low reading stand (a plain wedge) with the open book
    const x0 = 142,
      x1 = 258,
      yb = 160,
      yf = 224,
      zt = 50,
      zf = 22;
    const run = yf - yb;
    const rise = zt - zf;
    const L = Math.hypot(run, rise);
    const cb = run / L;
    const sb = rise / L;
    svg += poly([
      [x1, yb, 8],
      [x1, yf, 8],
      [x1, yf, zf],
      [x1, yb, zt],
    ]);
    svg += poly([
      [x0, yf, 8],
      [x1, yf, 8],
      [x1, yf, zf],
      [x0, yf, zf],
    ]);
    svg += poly(
      [
        [x0, yb, zt],
        [x1, yb, zt],
        [x1, yf, zf],
        [x0, yf, zf],
      ],
      "face top",
    );
    svg += `<g transform="${SIDE(x1, yf, zf)}"><path class="detail" d="M5 4 L${run - 6} ${-rise + 9.5}"/></g>`;
    svg += `<g transform="${FRONT(x0, yf, zf)}"><line class="detail" x1="4" y1="4" x2="${x1 - x0 - 4}" y2="4"/></g>`;
    const SL = (x: number, s: number) =>
      plane([x, yb + s * cb, zt - s * sb], [1, 0, 0], [0, cb, -sb]);
    const lines = (a: number, b: number, ys: number[]) =>
      ys.map((y) => `<line class="detail" x1="${a}" y1="${y}" x2="${b}" y2="${y}"/>`).join("");
    svg += `<g transform="${SL(x0 + 8, 7)}">
      <rect class="face" x="-3" y="-2" width="106" height="56" rx="1.5"/>
      <path class="face top" d="M50 3 Q25 -1 1 2 L1 51 Q25 49 50 52 Z"/>
      <path class="face top" d="M50 3 Q75 -1 99 2 L99 51 Q75 49 50 52 Z"/>
      <line class="detail" x1="50" y1="3" x2="50" y2="52"/>
      ${lines(6, 44, [10, 15, 20, 25, 30, 35, 40, 45])}
      <text id="su-head" class="su-pg" x="55" y="11" font-size="6"></text>
      <rect id="su-band" class="su-band" x="53" y="15.5" width="42" height="16" rx="1"/>
      ${[19.5, 23.5, 27.5].map((y) => `<line class="su-ql" x1="56" y1="${y}" x2="${y > 27 ? 78 : 92}" y2="${y}"/>`).join("")}
      ${lines(56, 92, [36, 40])}
      <text id="su-page" class="su-pg" x="95" y="48.5" font-size="6" text-anchor="end">p. —</text></g>`;
    svg += box(x0 + 4, 217, 23, x1 - x0 - 8, 5, 5);

    stage.setAttribute("viewBox", K.viewBox);
    stage.innerHTML = svg;
    const $ = (id: string) => stage.querySelector<SVGElement>("#su-" + id)!;
    const books = T.map((_, i) => $("book" + i));
    const leds = STAGES.map((_, i) => $("led" + i));
    const scr = $("scr");

    const st = {
      n: 0,
      i: -1,
      typed: 0,
      phase: "idle" as "idle" | "typing" | "search" | "cited" | "none",
      lit: false,
      leds: 0,
      busy: false,
    };
    let gen = 0;
    const later = (ms: number, fn: () => void) => {
      const g = gen;
      api.after(ms, () => {
        if (g === gen) fn();
      });
    };
    const cur = () => QS[Math.max(st.i, 0)];

    const t = (x: number, y: number, size: number, s: string, cls = "su-ink", anchor = "start") =>
      `<text class="${cls}" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${esc(s)}</text>`;

    function screen() {
      if (st.phase === "idle")
        return `${t(14, 22, 7, "ask a question")}<rect class="scr-accent blink" x="74" y="16" width="4" height="7"/>
          <rect class="su-card off" x="13" y="31" width="98" height="42" rx="2.5"/>
          ${t(62, 50, 6, "answers cite", "su-mute", "middle")}${t(62, 59, 6, "the page", "su-mute", "middle")}`;
      const q = cur();
      // a refused question keeps its tag unlit: nothing lights without a source
      let s = `<rect class="${st.phase === "none" ? "su-tag" : "scr-accent"}" x="13" y="13" width="13" height="10" rx="2"/>
        ${t(19.5, 20.2, 6, `q${st.n}`, "su-on", "middle")}${t(30, 20.5, 6.5, q.q.slice(0, st.typed))}`;
      if (st.phase === "typing")
        s += `<rect class="scr-accent" x="${30 + st.typed * 3.9}" y="14.5" width="3.5" height="7"/>`;
      s += `<line class="detail" x1="13" y1="27" x2="111" y2="27"/>`;
      if (st.phase === "search")
        s += `<rect class="su-card off" x="13" y="31" width="98" height="42" rx="2.5"/>${t(62, 54, 6.5, "finding the page…", "su-mute", "middle")}`;
      if (st.phase === "none")
        s += `<rect class="su-card off" x="13" y="31" width="98" height="42" rx="2.5"/>
          ${t(62, 50, 7.5, "not in the source", "su-ink", "middle")}${t(62, 61, 6, "nothing to cite", "su-mute", "middle")}`;
      if (st.phase === "cited")
        s += `<rect class="su-card on" x="13" y="31" width="98" height="42" rx="2.5"/>
          ${t(19, 41, 7, q.head)}${t(105, 41, 7, `p. ${q.page}`, "su-hot", "end")}
          <rect class="scr-accent" x="19" y="45" width="1.8" height="13"/>
          <line class="su-ql" x1="25" y1="47.5" x2="102" y2="47.5"/><line class="su-ql" x1="25" y1="51.8" x2="96" y2="51.8"/><line class="su-ql" x1="25" y1="56" x2="74" y2="56"/>
          ${t(19, 68, 6, `kitab ${q.book + 1} · p. ${q.page}`, "su-hot")}
          ${t(105, 68, 6, "open", "su-hot", "end")}<line class="su-link" x1="91" y1="69.6" x2="105" y2="69.6"/>`;
      return s;
    }

    function render() {
      const q = cur();
      books.forEach((b, i) => b.classList.toggle("latched", st.lit && i === q.book));
      leds.forEach((l, i) => l.classList.toggle("hot", i < st.leds));
      $("glass").classList.toggle("hot", st.phase !== "idle" && st.phase !== "none");
      $("band").classList.toggle("on", st.lit);
      $("page").classList.toggle("on", st.lit);
      $("head").classList.toggle("on", st.lit);
      $("page").textContent = st.lit ? `p. ${q.page}` : "p. —";
      $("head").textContent = st.lit ? q.head : "";
      const hot = $("whot");
      hot.style.opacity = st.lit ? "1" : "0";
      hot.setAttribute("d", q.book >= 0 ? route(trunk(mid(q.book))) : "");
      scr.innerHTML = screen();
      api.power(st.phase !== "idle" && st.phase !== "none");
      api.readout(
        st.phase === "idle"
          ? "ready · ask a question"
          : st.phase === "cited"
            ? `q ${st.n} · cited p. ${q.page}`
            : st.phase === "none"
              ? `q ${st.n} · not in the source`
              : `q ${st.n} · ${st.phase === "typing" ? "asking" : "finding the page"}…`,
      );
    }

    function ask() {
      if (st.busy) return;
      st.busy = true;
      st.i = (st.i + 1) % QS.length;
      st.n++;
      Object.assign(st, { typed: 0, phase: "typing", lit: false, leds: 0 });
      const q = cur();
      const type = () => {
        st.typed++;
        render();
        if (st.typed < q.q.length) later(26, type);
        else
          later(160, () => {
            st.phase = "search";
            render();
            later(380, q.book >= 0 ? cite : refuse);
          });
      };
      later(80, type);
      render();
    }

    function cite() {
      const q = cur();
      $("pulse").setAttribute("d", route(trunk(mid(q.book))));
      api.replay($("pulse"), "go");
      later(540, () => {
        Object.assign(st, { phase: "cited", lit: true });
        api.flash(books[q.book], 200);
        render();
        STAGES.forEach((_, i) =>
          later(220 + i * 240, () => {
            st.leds = i + 1;
            render();
          }),
        );
        later(220 + 2 * 240, () => {
          st.busy = false;
        });
      });
    }

    function refuse() {
      st.phase = "none";
      st.busy = false;
      render();
    }

    function reset() {
      gen++;
      Object.assign(st, { n: 0, i: -1, typed: 0, phase: "idle", lit: false, leds: 0, busy: false });
      render();
    }

    $("term").addEventListener("click", ask);
    render();
    return {
      key: (e) => {
        if (e.key === " " || e.key === "Enter") {
          ask();
          return true;
        }
        if (e.key === "r" || e.key === "R") {
          reset();
          return true;
        }
        return false;
      },
      demo: () => [200, 2700, 4200].forEach((ms) => api.after(ms, ask)),
    };
  },
};
