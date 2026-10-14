// Canvas to code: an agent reads the design canvas over mcp, scaffolds the
// component in the editor, and every generated line passes four checks (fmt,
// lint, types, test) before the ship lamp lights. f arms a failing check.
import type { IsoFig } from "../types";

type Phase = "idle" | "read" | "sync" | "code" | "check" | "fail" | "ship";

const CHECKS = ["fmt", "lint", "types", "test"];
const FAIL = 2; // the check that f makes fail
// code rows: indent, width, keyword width
const CODE: [indent: number, width: number, head: number][] = [
  [0, 70, 16],
  [1, 84, 22],
  [2, 60, 12],
  [2, 92, 14],
  [2, 48, 10],
  [1, 34, 8],
  [1, 76, 18],
  [0, 26, 8],
];
const BAD = 3; // the row the failing check points at

export const loop: IsoFig = {
  id: "lp",
  name: "Canvas to code",
  hint: "click the canvas · space run · f fail a check",
  aria: "Isometric design canvas with frames and token swatches, wired over mcp to a code editor, then to a check unit with four lights for fmt, lint, types and test, and a ship lamp. Click the canvas or press space to run the loop: the canvas syncs to the editor, code lines appear, the checks light one by one and the ship lamp lights. Press f to make the types check fail; the run stops there until you press space to fix and rerun.",
  css: `
    [data-fig="lp"] .glass { vector-effect:non-scaling-stroke; }
    [data-fig="lp"] .lp-pad { cursor:pointer; }
    [data-fig="lp"] .lp-fr { fill:var(--panel); stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="lp"] .lp-fr.sel { stroke:var(--accent); stroke-width:1.8; stroke-dasharray:3 2; }
    [data-fig="lp"] .lp-ui { fill:var(--deck); stroke:var(--detail); stroke-width:1; vector-effect:non-scaling-stroke; transition:fill .3s, stroke .3s; }
    [data-fig="lp"] .lp-ui.on { fill:var(--accent); stroke:var(--accent); }
    [data-fig="lp"] .lp-uo { fill:var(--panel); stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="lp"] .lp-bar { fill:var(--detail); }
    [data-fig="lp"] .lp-sw { stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="lp"] .lp-tab { fill:var(--deck); stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="lp"] .lp-k { fill:var(--accent); }
    [data-fig="lp"] .lp-c { fill:var(--accent-hi); }
    [data-fig="lp"] .lp-row { transition:opacity .12s; }
    [data-fig="lp"] .lp-err { fill:none; stroke:var(--accent); stroke-width:1.6; vector-effect:non-scaling-stroke; stroke-linejoin:round; }
    [data-fig="lp"] .lp-ring { fill:none; stroke:var(--accent); stroke-width:1.6; vector-effect:non-scaling-stroke; opacity:0; }
    [data-fig="lp"] .lp-ring.on { opacity:1; }
    [data-fig="lp"] .press.lit .lp-st, [data-fig="lp"] .press.latched .lp-st { fill:var(--panel); }
    @media (prefers-reduced-motion: reduce) { [data-fig="lp"] .lp-row { transition:none; } }
  `,
  mount(stage, api) {
    const K = api.iso.frame([
      [0, 0, 0],
      [446, 0, 0],
      [0, 240, 0],
      [446, 240, 0],
      [168, 36, 128],
      [384, 144, 60],
    ]);
    const { TOP, FRONT, SIDE, box } = K;
    const { slits } = api.iso;

    // ground plate, printed wire label
    let svg = box(0, 0, 0, 446, 240, 8, 14);
    svg += `<g transform="${TOP(0, 0, 8)}"><rect class="detail" x="10" y="10" width="426" height="220" rx="8"/>
      ${[
        [18, 18],
        [428, 18],
        [18, 222],
        [428, 222],
      ]
        .map(([x, y]) => `<circle class="detail" cx="${x}" cy="${y}" r="3"/>`)
        .join("")}
      <text class="label" x="176" y="145" font-size="10">mcp</text>
      <text class="label" x="196" y="200" font-size="10">loop</text></g>`;

    // canvas → editor (mcp), editor → checks, and back to the canvas once shipped
    const WIRES = [
      "M160 152 H240 Q248 152 248 144 V66",
      "M281 48 H368 Q376 48 376 56 V136",
      "M316 186 H300 Q292 186 292 194 V198 Q292 206 284 206 H160",
    ];
    svg += `<g transform="${TOP(0, 0, 8)}">${WIRES.map(
      (d, i) =>
        `<path class="wire-under" d="${d}"/><path id="lp-w${i}" class="wire" d="${d}"/><path id="lp-p${i}" class="pulse" pathLength="1000" d="${d}"/>`,
    ).join("")}</g>`;

    // the design canvas: a board lying on the plate with frames and tokens
    const SW = ["var(--ink-hi)", "var(--panel)", "var(--line)", "var(--accent)"];
    svg += `<g class="lp-pad" id="lp-mat">${box(10, 76, 8, 150, 150, 5, 6)}
      <g transform="${TOP(10, 76, 13)}">
        <rect id="lp-cv" class="glass" x="8" y="8" width="134" height="134" rx="4"/>
        <text class="label" x="18" y="23" font-size="8">card</text>
        <rect class="lp-fr" x="18" y="27" width="56" height="74" rx="1"/>
        <rect class="face recess" x="24" y="33" width="44" height="26" rx="1"/>
        <rect class="lp-bar" x="24" y="65" width="38" height="3.5"/>
        <rect class="lp-bar" x="24" y="72" width="28" height="3.5"/>
        <rect class="lp-ui" x="24" y="83" width="30" height="11" rx="2"/>
        <text class="label" x="86" y="23" font-size="8">stepper</text>
        <rect class="lp-fr" x="86" y="27" width="50" height="30" rx="1"/>
        <rect class="lp-uo" x="91" y="35" width="40" height="14" rx="2"/>
        <rect class="lp-ui" x="92.5" y="36.5" width="11" height="11" rx="1.5"/>
        <rect class="lp-ui" x="118.5" y="36.5" width="11" height="11" rx="1.5"/>
        <text class="label" x="86" y="70" font-size="8">button</text>
        <rect class="lp-fr" x="86" y="74" width="50" height="27" rx="1"/>
        <rect class="lp-ui" x="93" y="81" width="36" height="13" rx="6.5"/>
        <text class="label" x="18" y="118" font-size="8">tokens</text>
        ${SW.map((c, k) => `<rect class="lp-sw" x="${18 + k * 18}" y="122" width="14" height="14" rx="2" style="fill:${c}"/>`).join("")}
      </g></g>`;

    // the editor: a monitor on a foot and neck, code rows on the glass
    svg += box(215, 24, 8, 66, 42, 5, 5);
    svg += box(242, 30, 13, 12, 8, 12);
    svg += box(168, 36, 24, 160, 10, 104, 3);
    const rowY = (k: number) => 28 + k * 8.4;
    svg += `<g transform="${FRONT(168, 46, 128)}">
      <rect id="lp-ed" class="glass" x="6" y="6" width="148" height="92" rx="2"/>
      <rect class="face recess" x="6" y="6" width="148" height="13" rx="2"/>
      <rect class="lp-tab" x="6" y="6" width="60" height="13" rx="2"/>
      <text class="label" x="12" y="15.5" font-size="7.5">stepper.tsx</text>
      ${CODE.map((_, k) => `<line class="detail" x1="11" y1="${rowY(k) + 2}" x2="16" y2="${rowY(k) + 2}"/>`).join("")}
      ${CODE.map(([ind, w, hd], k) => {
        const x = 22 + ind * 8;
        return `<g class="lp-row" id="lp-r${k}" style="opacity:0"><rect class="lp-k" x="${x}" y="${rowY(k)}" width="${hd}" height="4" rx="1"/>
          <rect class="lp-c" x="${x + hd + 3}" y="${rowY(k)}" width="${w - hd - 3}" height="4" rx="1"/></g>`;
      }).join("")}
      <rect id="lp-cur" class="scr-accent blink" x="0" y="0" width="2" height="7" style="opacity:0"/>
      <path id="lp-err" class="lp-err" style="opacity:0" d="M${22 + CODE[BAD][0] * 8} ${rowY(BAD) + 7}${Array.from(
        { length: 15 },
        (_, i) => ` l3 ${i % 2 ? -2 : 2}`,
      ).join("")}"/></g>`;

    // the check unit: four lights on the front, a vent and the ship lamp on top
    svg += `<g class="lp-pad" id="lp-unit">${box(316, 136, 8, 112, 58, 36, 5)}
      <g transform="${TOP(316, 136, 44)}"><text class="label" x="12" y="20" font-size="9">checks</text>${slits(12, 52, 6, 28, 50)}</g>
      <g transform="${FRONT(316, 194, 44)}">${CHECKS.map(
        (name, k) => `<circle id="lp-ring${k}" class="lp-ring" cx="${17 + k * 26}" cy="13" r="8.5"/>
          <circle id="lp-l${k}" class="led" cx="${17 + k * 26}" cy="13" r="5.5"/>
          <text class="label" x="${17 + k * 26}" y="30" font-size="7.5" text-anchor="middle">${name}</text>`,
      ).join("")}</g>
      <g transform="${SIDE(428, 194, 44)}">${slits(8, 50, 6, 8, 28)}</g></g>`;
    svg += `<g class="press" id="lp-ship">${box(384, 144, 44, 34, 40, 16, 7)}
      <g transform="${FRONT(384, 184, 60)}"><text class="label lp-st" x="17" y="11" font-size="8.5" text-anchor="middle">ship</text></g></g>`;

    stage.setAttribute("viewBox", K.viewBox);
    stage.innerHTML = svg;
    const $ = (id: string) => stage.querySelector<SVGElement>("#lp-" + id)!;
    const all = (sel: string) => [...stage.querySelectorAll<SVGElement>(sel)];
    const frames = all(".lp-fr");
    const uis = all(".lp-ui");
    const rows = CODE.map((_, k) => $("r" + k));
    const leds = CHECKS.map((_, k) => $("l" + k));
    const rings = CHECKS.map((_, k) => $("ring" + k));
    const wires = [0, 1, 2].map((i) => $("w" + i));
    const pulses = [0, 1, 2].map((i) => $("p" + i));
    const ship = $("ship");
    const cur = $("cur");

    const st = { phase: "idle" as Phase, lines: 0, checks: 0, armed: false, gen: 0 };

    function render() {
      const ph = st.phase;
      const live = ph !== "idle";
      $("cv").classList.toggle("hot", live);
      frames.forEach((f) => f.classList.toggle("sel", ph === "read" || ph === "sync"));
      uis.forEach((u) => u.classList.toggle("on", live));
      wires[0].classList.toggle("hot", live && ph !== "read");
      wires[1].classList.toggle("hot", ph === "check" || ph === "fail" || ph === "ship");
      wires[2].classList.toggle("hot", ph === "ship");
      $("ed").classList.toggle("hot", st.lines > 0);
      rows.forEach((r, k) => (r.style.opacity = k < st.lines ? "1" : "0"));
      if (ph === "code" && st.lines > 0) {
        const [ind, w] = CODE[st.lines - 1];
        cur.setAttribute("x", String(22 + ind * 8 + w + 3));
        cur.setAttribute("y", String(rowY(st.lines - 1) - 1.5));
      }
      cur.style.opacity = ph === "code" ? "1" : "0";
      $("err").style.opacity = ph === "fail" ? "1" : "0";
      leds.forEach((l, k) => {
        const bad = ph === "fail" && k === FAIL;
        l.classList.toggle("hot", k < st.checks || bad);
        l.classList.toggle("blink", bad);
      });
      rings.forEach((r, k) => r.classList.toggle("on", ph === "fail" && k === FAIL));
      ship.classList.toggle("latched", ph === "ship");
      api.power(live);
      const n = CHECKS.length;
      const text: Record<Phase, string> = {
        idle: st.armed
          ? `${CHECKS[FAIL]} will fail · space to run`
          : "idle · space to run the loop",
        read: "agent reading the canvas…",
        sync: "syncing tokens over mcp…",
        code: `scaffolding · ${st.lines}/${CODE.length} lines`,
        check: `reviewing · ${st.checks}/${n} checks`,
        fail: `${CHECKS[FAIL]} failed · ${st.checks}/${n} checks · space to fix and rerun`,
        ship: `synced · ${n}/${n} checks · shipped${st.armed ? ` · ${CHECKS[FAIL]} fails next` : ""}`,
      };
      api.readout(text[ph]);
    }

    // one pass of the loop; a newer run (or a failure) cancels the rest
    function run() {
      if (st.phase === "fail") st.armed = false; // the fix
      const g = ++st.gen;
      const at = (ms: number, fn: () => void) =>
        api.after(ms, () => {
          if (g !== st.gen) return;
          fn();
          render();
        });
      Object.assign(st, { phase: "read", lines: 0, checks: 0 });
      render();
      let t = 280;
      at(t, () => {
        st.phase = "sync";
        api.replay(pulses[0]);
      });
      t += 560;
      CODE.forEach((_, k) =>
        at(t + k * 60, () => {
          st.phase = "code";
          st.lines = k + 1;
        }),
      );
      t += CODE.length * 60 + 100;
      at(t, () => {
        st.phase = "check";
        api.replay(pulses[1]);
      });
      t += 540;
      CHECKS.forEach((_, k) =>
        at(t + k * 220, () => {
          if (st.armed && k === FAIL) {
            st.phase = "fail";
            st.gen++;
            return;
          }
          st.checks = k + 1;
        }),
      );
      t += CHECKS.length * 220;
      at(t + 120, () => {
        st.phase = "ship";
        api.flash(ship, 260);
        api.replay(pulses[2]);
      });
    }

    function toggleFail() {
      st.armed = !st.armed;
      render();
    }

    $("mat").addEventListener("click", run);
    $("unit").addEventListener("click", toggleFail);
    ship.addEventListener("click", run);
    render();

    return {
      key: (e) => {
        if (e.key === " " || e.key === "Enter") {
          run();
          return true;
        }
        if (e.key === "f" || e.key === "F") {
          toggleFail();
          return true;
        }
        return false;
      },
      demo: () => {
        api.after(150, () => {
          st.armed = true;
          render();
        });
        api.after(300, run);
        api.after(3400, run);
      },
    };
  },
};
