// Token sync, the prompt that worked: instead of "match the design" (which
// invented new greys), the agent compares named tokens and shows a diff, and
// nothing is written until the "show diff first" key is pressed.
import type { IsoFig } from "../types";

type Kind = "same" | "changed" | "missing";
type Phase = "idle" | "compare" | "diff" | "apply" | "done";
type Row = { name: string; kind: Kind; was: string; now: string };

// design tokens (the board) against the code file, matched by name
const ROWS: Row[] = [
  { name: "ink", kind: "same", was: "var(--ink-hi)", now: "var(--ink-hi)" },
  { name: "paper", kind: "same", was: "var(--panel)", now: "var(--panel)" },
  { name: "line", kind: "changed", was: "var(--detail)", now: "var(--line)" },
  { name: "accent", kind: "missing", was: "", now: "var(--accent)" },
];
const GLYPH: Record<Kind, string> = { same: "=", changed: "~", missing: "+" };
const CHANGED = ROWS.filter((r) => r.kind === "changed").length;
const MISSING = ROWS.filter((r) => r.kind === "missing").length;

export const tokens: IsoFig = {
  id: "tk",
  name: "Token sync",
  hint: "space compare by name · click the key or a to apply",
  aria: "Isometric token board with four named swatches, ink, paper, line and accent, wired through an agent console with a show diff first key to a code file. Press space or click the board to compare the tokens by name: each row of the file lights in turn and is marked unchanged, changed or missing. Nothing is written until you click the key or press a; then the file updates with one changed and one added token and no invented ones.",
  css: `
    [data-fig="tk"] .glass { vector-effect:non-scaling-stroke; }
    [data-fig="tk"] .tk-pad { cursor:pointer; }
    [data-fig="tk"] .tk-sw { stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="tk"] .tk-pick { fill:none; stroke:none; stroke-width:1.8; vector-effect:non-scaling-stroke; }
    [data-fig="tk"] .tk-pick.on { stroke:var(--accent); }
    [data-fig="tk"] .tk-hl { fill:var(--accent-hi); }
    [data-fig="tk"] .tk-band { fill:var(--panel); opacity:.6; }
    [data-fig="tk"] .tk-m0 { fill:none; stroke:var(--detail); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="tk"] .tk-m1 { fill:var(--panel); stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="tk"] .tk-m2 { fill:var(--accent); stroke:var(--accent); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="tk"] .tk-m3 { fill:var(--panel); stroke:var(--accent); stroke-width:1.8; vector-effect:non-scaling-stroke; }
    [data-fig="tk"] .tk-t1 { fill:var(--ink); }
    [data-fig="tk"] .tk-t2 { fill:var(--panel); }
    [data-fig="tk"] .tk-t3 { fill:var(--accent); }
    [data-fig="tk"] .tk-name { fill:var(--ink-hi); }
    [data-fig="tk"] .tk-gone { fill:var(--line); }
    [data-fig="tk"] .tk-chip { stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="tk"] .tk-gap { fill:none; stroke:var(--line); stroke-width:1; stroke-dasharray:2 1.5; vector-effect:non-scaling-stroke; }
    [data-fig="tk"] .tk-arrow { fill:var(--ink); }
    [data-fig="tk"] .tk-fst { fill:var(--ink); }
    [data-fig="tk"] .tk-fst.on { fill:var(--accent); }
    [data-fig="tk"] .press.lit .tk-kt, [data-fig="tk"] .press.latched .tk-kt { fill:var(--ink-hi); }
  `,
  mount(stage, api) {
    const K = api.iso.frame([
      [0, 0, 0],
      [396, 0, 0],
      [0, 214, 0],
      [396, 214, 0],
      [20, 160, 126],
      [110, 40, 80],
      [366, 14, 130],
    ]);
    const { TOP, FRONT, SIDE, box } = K;
    const { esc } = api.iso;

    // ground plate, printed wire labels
    let svg = box(0, 0, 0, 396, 214, 8, 14);
    svg += `<g transform="${TOP(0, 0, 8)}"><rect class="detail" x="10" y="10" width="376" height="194" rx="8"/>
      ${[
        [18, 18],
        [378, 18],
        [18, 196],
        [378, 196],
      ]
        .map(([x, y]) => `<circle class="detail" cx="${x}" cy="${y}" r="3"/>`)
        .join("")}
      <text class="label" x="128" y="200" font-size="9">by name</text>
      <text class="label" x="282" y="184" font-size="9">apply</text></g>`;

    // board → agent (compare), agent → file (apply)
    const WIRES = ["M120 168 V178 Q120 186 128 186 H190", "M268 168 H350"];
    svg += `<g transform="${TOP(0, 0, 8)}">${WIRES.map(
      (d, i) =>
        `<path class="wire-under" d="${d}"/><path id="tk-w${i}" class="wire" d="${d}"/><path id="tk-p${i}" class="pulse" pathLength="1000" d="${d}"/>`,
    ).join("")}</g>`;

    // the prompt that failed, pinned at the back: "match the design"
    svg += box(104, 34, 8, 102, 20, 5, 3);
    svg += box(110, 40, 13, 90, 8, 67, 3);
    svg += `<g transform="${FRONT(110, 48, 80)}" opacity=".8">
      <text class="label" x="8" y="16" font-size="8">match the design</text>
      <line class="detail" x1="6" y1="13" x2="84" y2="13" style="stroke:var(--ink)"/>
      ${[0, 1, 2]
        .map(
          (
            k,
          ) => `<rect class="tk-chip" x="${8 + k * 20}" y="25" width="15" height="15" rx="2" style="fill:${["var(--line)", "var(--detail)", "var(--recess)"][k]}"/>
          <text class="label" x="${15.5 + k * 20}" y="35.5" font-size="8" text-anchor="middle">?</text>`,
        )
        .join("")}
      <text class="label" x="8" y="54" font-size="7.5">+3 greys invented</text></g>`;

    // the token board: four named swatches from the design file
    const SWX = (k: number) => 12 + k * 35;
    svg += `<g class="tk-pad" id="tk-board">${box(14, 144, 8, 166, 24, 6, 3)}${box(20, 150, 14, 154, 10, 112, 3)}
      <g transform="${FRONT(20, 160, 126)}">
        <text class="label" x="12" y="17" font-size="9">design</text>
        <line class="detail" x1="12" y1="22" x2="142" y2="22"/>
        ${ROWS.map(
          (
            r,
            k,
          ) => `<rect id="tk-pick${k}" class="tk-pick" x="${SWX(k) - 3.5}" y="29.5" width="37" height="37" rx="3"/>
          <rect class="tk-sw" x="${SWX(k)}" y="33" width="30" height="30" rx="2" style="fill:${r.now}"/>
          <text class="label" x="${SWX(k) + 15}" y="80" font-size="9" text-anchor="middle">${r.name}</text>`,
        ).join("")}
        <text class="label" x="12" y="100" font-size="7.5" opacity=".75">4 named tokens</text></g></g>`;

    // the agent console with the gate key on top
    svg += box(190, 134, 8, 78, 64, 20, 6);
    svg += `<g transform="${FRONT(190, 198, 28)}"><text class="label" x="9" y="13.5" font-size="8.5">agent</text>
        <circle id="tk-led" class="led" cx="68" cy="10" r="3.4"/></g>
      <g transform="${SIDE(268, 198, 28)}"><rect class="face recess" x="26" y="9" width="8" height="7" rx="1"/></g>`;
    svg += `<g class="press" id="tk-gate">${box(202, 142, 28, 54, 42, 9, 6)}
      <g transform="${TOP(202, 142, 37)}">
        <text class="label tk-kt" x="27" y="19" font-size="8.5" text-anchor="middle">show diff</text>
        <text class="label tk-kt" x="27" y="30" font-size="8.5" text-anchor="middle">first</text></g></g>`;

    // the code file: a long wall facing right, one diff row per token name
    const rowY = (k: number) => 27 + k * 20;
    svg += `<g class="tk-pad" id="tk-file">${box(350, 8, 8, 26, 198, 6, 3)}${box(356, 14, 14, 10, 186, 116, 3)}
      <g transform="${SIDE(366, 200, 130)}">
        <rect id="tk-gl" class="glass" x="6" y="6" width="174" height="104" rx="2"/>
        <rect class="face recess" x="6" y="6" width="174" height="14" rx="2"/>
        <text class="label" x="13" y="16.5" font-size="8.5">tokens.css</text>
        <text id="tk-fst" class="tk-fst" x="173" y="16.5" font-size="8" text-anchor="end"></text>
        <g id="tk-rows"></g></g></g>`;

    stage.setAttribute("viewBox", K.viewBox);
    stage.innerHTML = svg;
    const $ = (id: string) => stage.querySelector<SVGElement>("#tk-" + id)!;
    const picks = ROWS.map((_, k) => $("pick" + k));
    const wires = [0, 1].map((i) => $("w" + i));
    const pulses = [0, 1].map((i) => $("p" + i));
    const gate = $("gate");

    const st = { phase: "idle" as Phase, seen: 0, applied: false, note: "", gen: 0 };

    const chip = (x: number, y: number, fill: string, w = 26) =>
      `<rect class="tk-chip" x="${x}" y="${y + 4}" width="${w}" height="10" rx="1.5" style="fill:${fill}"/>`;

    function rows() {
      return ROWS.map((r, k) => {
        const y = rowY(k);
        const seen = k < st.seen;
        const now = st.phase === "compare" && k === st.seen;
        let s =
          k % 2 === 0
            ? `<rect class="tk-band" x="8" y="${y}" width="170" height="18" rx="1.5"/>`
            : "";
        if (now || (seen && r.kind !== "same"))
          s += `<rect class="tk-hl" x="8" y="${y}" width="170" height="18" rx="1.5" opacity="${now ? 0.6 : 0.3}"/>`;
        const m = !seen ? 0 : r.kind === "same" ? 1 : r.kind === "changed" ? 2 : 3;
        s += `<rect class="tk-m${m}" x="13" y="${y + 3}" width="12" height="12" rx="2"/>`;
        if (m)
          s += `<text class="tk-t${m}" x="19" y="${y + 12.5}" font-size="10" text-anchor="middle">${GLYPH[r.kind]}</text>`;
        const absent = r.kind === "missing" && !st.applied;
        s += `<text class="${absent ? "tk-gone" : "tk-name"}" x="33" y="${y + 13}" font-size="10">${esc(r.name)}</text>`;
        if (r.kind === "changed" && !st.applied)
          s += seen
            ? `${chip(76, y, r.was, 20)}<text class="tk-arrow" x="102" y="${y + 12.5}" font-size="8" text-anchor="middle">→</text>${chip(108, y, r.now, 22)}`
            : chip(76, y, r.was);
        else if (absent)
          s += `<rect class="tk-gap" x="76" y="${y + 4}" width="26" height="10" rx="1.5"/>`;
        else s += chip(76, y, r.now);
        return s;
      }).join("");
    }

    function render() {
      const ph = st.phase;
      $("rows").innerHTML = rows();
      $("gl").classList.toggle("hot", ph !== "idle");
      picks.forEach((p, k) => p.classList.toggle("on", ph === "compare" && k === st.seen));
      wires[0].classList.toggle("hot", ph !== "idle");
      wires[1].classList.toggle("hot", ph === "apply" || ph === "done");
      gate.classList.toggle("latched", ph === "apply" || ph === "done");
      const led = $("led");
      led.classList.toggle("hot", ph === "diff" || ph === "apply" || ph === "done");
      led.classList.toggle("blink", ph === "diff");
      const fst = $("fst");
      fst.textContent =
        ph === "compare"
          ? "diff…"
          : ph === "diff"
            ? `${CHANGED + MISSING} to apply`
            : ph === "apply"
              ? "writing…"
              : ph === "done"
                ? "applied"
                : "";
      fst.classList.toggle("on", ph === "diff" || ph === "done");
      api.power(ph !== "idle");
      const text: Record<Phase, string> = {
        idle: "space to compare tokens by name",
        compare: `comparing by name · ${st.seen}/${ROWS.length}`,
        diff: `diff shown · ${CHANGED} changed · ${MISSING} missing · a to apply`,
        apply: `applying ${CHANGED + MISSING} tokens…`,
        done: `${ROWS.length} tokens · ${CHANGED} changed · ${MISSING} added · 0 invented`,
      };
      api.readout(st.note || text[ph]);
    }

    // read the board and the file, then mark each row by name
    function compare() {
      const g = ++st.gen;
      const at = (ms: number, fn: () => void) =>
        api.after(ms, () => {
          if (g !== st.gen) return;
          fn();
          render();
        });
      Object.assign(st, { phase: "compare", seen: 0, applied: false, note: "" });
      api.replay(pulses[0]);
      at(300, () => api.replay(pulses[1]));
      ROWS.forEach((_, k) =>
        at(700 + k * 330, () => {
          st.seen = k + 1;
          if (k === ROWS.length - 1) st.phase = "diff";
        }),
      );
      render();
    }

    // the gate: only a shown diff can be applied
    function apply() {
      if (st.phase !== "diff") {
        if (st.phase === "idle" || st.phase === "done") {
          st.note = "show diff first · space to compare";
          render();
          api.after(1600, () => {
            st.note = "";
            render();
          });
        }
        return;
      }
      const g = ++st.gen;
      st.phase = "apply";
      api.flash(gate, 200);
      api.replay(pulses[1]);
      render();
      api.after(560, () => {
        if (g !== st.gen) return;
        st.phase = "done";
        st.applied = true;
        render();
      });
    }

    function run() {
      if (st.phase === "compare" || st.phase === "apply") return;
      compare();
    }

    $("board").addEventListener("click", run);
    $("file").addEventListener("click", run);
    gate.addEventListener("click", () => (st.phase === "diff" ? apply() : run()));
    render();

    return {
      key: (e) => {
        if (e.key === " " || e.key === "Enter") {
          run();
          return true;
        }
        if (e.key === "a" || e.key === "A") {
          apply();
          return true;
        }
        return false;
      },
      demo: () => {
        api.after(200, run);
        api.after(3000, apply);
      },
    };
  },
};
