// A pictogram set checked by an agent: sixteen real glyphs on one 24 px grid,
// a scanner gantry that sweeps the rows, two curves off the half-pixel to fix
// and one safe-area break kept on purpose.
import { pictogramMarkup } from "../../art/pictogram-markup";
import type { IsoFig } from "../types";

type Glyph = keyof typeof pictogramMarkup;
type Flag = "" | "fix" | "keep";

const SET: Glyph[] = [
  "leaf",
  "sun",
  "truck",
  "chart",
  "drop",
  "factory",
  "sack",
  "calendar",
  "shield",
  "box",
  "person",
  "pin",
  "doc",
  "chat",
  "sprout",
  "scale",
];
// two curves that crept off the half-pixel (real mistakes), in glyph units
const DRIFT: Partial<Record<Glyph, [number, number]>> = { drop: [1.3, 0.9], pin: [-1.1, 1.2] };
// the truck's wheels sit outside the safe area on purpose
const KEEP: Glyph = "truck";

export const pictograms: IsoFig = {
  id: "pg",
  name: "Pictogram check",
  hint: "click the scanner · space scan / fix · r resets",
  aria: "Isometric plate holding sixteen pictograms on a four by four grid of tiles, with a scanner gantry over them. Click the scanner or press space to sweep it across the rows: each glyph is checked against the keylines and the safe area, two are flagged to fix and one is flagged and kept on purpose. Press space again to fix the two flagged glyphs. Press r to reset.",
  css: `
    [data-fig="pg"] .pg-safe { fill:none; stroke:var(--detail); stroke-width:1; vector-effect:non-scaling-stroke; stroke-dasharray:3 2; transition:stroke .3s; }
    [data-fig="pg"] .pg-safe.hot { stroke:var(--accent); }
    [data-fig="pg"] .pg-glyph { transition:transform .6s cubic-bezier(.3,.7,.3,1); }
    [data-fig="pg"] .pg-ghost { opacity:0; transition:opacity .4s; }
    [data-fig="pg"] .pg-ghost.on { opacity:1; }
    [data-fig="pg"] .pg-ring { fill:var(--accent); fill-opacity:.1; stroke:var(--accent); stroke-width:2; vector-effect:non-scaling-stroke; opacity:0; transition:opacity .25s; }
    [data-fig="pg"] .pg-ring.on { opacity:1; }
    [data-fig="pg"] .pg-ring.keep { stroke-dasharray:5 3; }
    [data-fig="pg"] .pg-ok { fill:none; stroke:var(--ink-hi); stroke-width:1.6; vector-effect:non-scaling-stroke; stroke-linecap:round; stroke-linejoin:round; opacity:0; transition:opacity .2s; }
    [data-fig="pg"] .pg-ok.on { opacity:1; }
    [data-fig="pg"] .pg-flag { display:none; }
    [data-fig="pg"] .pg-flag.on { display:inline; }
    [data-fig="pg"] .pg-pole { fill:none; stroke:var(--ink-hi); stroke-width:1.2; vector-effect:non-scaling-stroke; }
    [data-fig="pg"] .pg-pen { fill:var(--accent); stroke:var(--accent); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="pg"] .pg-pen-t { fill:var(--panel); font-family:var(--mono); font-weight:600; }
    [data-fig="pg"] .pg-keep .pg-pen { fill:var(--panel); }
    [data-fig="pg"] .pg-keep .pg-pen-t { fill:var(--accent); }
    [data-fig="pg"] .pg-laser { fill:none; stroke:var(--accent); stroke-width:2.4; vector-effect:non-scaling-stroke; stroke-linecap:round; opacity:0; }
    [data-fig="pg"] .pg-laser.on { opacity:1; }
    [data-fig="pg"] .pg-strip { fill:var(--recess); stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; transition:fill .2s; }
    [data-fig="pg"] .pg-strip.on { fill:var(--accent); stroke:var(--accent-hi); }
    [data-fig="pg"] #pg-gantry { cursor:pointer; }
    [data-fig="pg"] .pg-tile { cursor:default; }
    [data-fig="pg"] .pg-tile.can { cursor:pointer; }
  `,
  mount(stage, api) {
    const TS = 62,
      TG = 8,
      GW = 4 * TS + 3 * TG;
    const GX = 40,
      GY = 76,
      TZ = 18;
    const PW = GX + GW + 40,
      PD = GY + GW + 26;
    const HOME = 14; // gantry parked behind the first row
    const RX0 = GX - 26,
      RX1 = GX + GW + 14; // rails along y

    const K = api.iso.frame(
      [
        [0, 0, 0],
        [PW, 0, 0],
        [0, PD, 0],
        [PW, PD, 0],
        [RX0 - 2, HOME, 63],
        [RX1 + 14, HOME, 63],
      ],
      0.06,
    );
    const { C, S, P, TOP, FRONT, SIDE, box } = K;
    const { slits } = api.iso;

    // ground plate, inset line, screws, printed spec
    let svg = box(0, 0, 0, PW, PD, 8, 14);
    svg += `<g transform="${TOP(0, 0, 8)}"><rect class="detail" x="10" y="10" width="${PW - 20}" height="${PD - 20}" rx="8"/>
      ${[
        [18, 18],
        [PW - 18, 18],
        [18, PD - 18],
        [PW - 18, PD - 18],
      ]
        .map(([x, y]) => `<circle class="detail" cx="${x}" cy="${y}" r="3"/>`)
        .join("")}
      <text class="label" x="${GX + 2}" y="${GY + GW + 16}" font-size="8" opacity=".75">24 px grid · 1.5 stroke</text></g>`;

    // gantry rails with teeth
    [RX0, RX1].forEach((x) => {
      svg += box(x, 8, 8, 12, PD - 16, 5, 0);
      svg += `<g transform="${TOP(x, 8, 13)}"><line class="detail" x1="6" y1="5" x2="6" y2="${PD - 21}"/></g>`;
    });

    // sixteen tiles, back to front, each with its glyph, keyline, check and flag
    const O = 10,
      SC = 42 / 24;
    const tiles = SET.map((name, i) => ({ name, i, r: Math.floor(i / 4), c: i % 4 }));
    [...tiles]
      .sort((a, b) => a.r + a.c - (b.r + b.c))
      .forEach(({ name, i, r, c }) => {
        const tx = GX + c * (TS + TG),
          ty = GY + r * (TS + TG);
        const glyph = (cls: string, color: string, id: string) =>
          `<g id="${id}" class="${cls}" style="color:var(${color})" fill="none" stroke-width="1.5">${pictogramMarkup[name]}</g>`;
        const flagW = name === KEEP ? 38 : 28;
        const [px, py] = [tx + 8, ty + 8];
        const ok = P(tx + 50, ty + 11, TZ);
        const a = P(px, py, TZ),
          b = P(px, py, TZ + 31);
        svg += `<g class="pg-tile" id="pg-t${i}">${box(tx, ty, 8, TS, TS, TZ - 8, 5)}
          <g transform="${TOP(tx, ty, TZ)}">
            <rect id="pg-safe${i}" class="pg-safe" x="${O + 2 * SC}" y="${O + 2 * SC}" width="${20 * SC}" height="${20 * SC}"/>
            <g transform="translate(${O} ${O}) scale(${SC})">
              ${DRIFT[name] ? glyph("pg-ghost", "--accent", `pg-ghost${i}`) : ""}
              ${glyph("pg-glyph", "--ink-hi", `pg-g${i}`)}</g>
            <rect id="pg-ring${i}" class="pg-ring${name === KEEP ? " keep" : ""}" x="2" y="2" width="${TS - 4}" height="${TS - 4}" rx="4"/></g>
          <path id="pg-ok${i}" class="pg-ok" d="M${(ok[0] - 4).toFixed(2)} ${(ok[1] - 2.5).toFixed(2)} l3.2 3.2 l6.6 -7"/>
          <g id="pg-f${i}" class="pg-flag">
            <path class="pg-pole" d="M${a[0].toFixed(2)} ${a[1].toFixed(2)} L${b[0].toFixed(2)} ${b[1].toFixed(2)}"/>
            <g transform="${FRONT(px, py, TZ + 31)}">
              <rect class="pg-pen" x="0" y="0" width="${flagW}" height="15" rx="1.5"/>
              <text id="pg-ft${i}" class="pg-pen-t" x="${flagW / 2}" y="11.2" font-size="12" text-anchor="middle">fix</text></g></g></g>`;
      });

    // scanner gantry, drawn at y = 0 and slid along y: laser on the tile
    // tops, two towers on the rails, the beam with its light strip
    svg += `<g id="pg-gantry">
      <g transform="${TOP(0, 0, TZ)}"><path id="pg-laser" class="pg-laser" d="${[0, 1, 2, 3]
        .map((c) => `M${GX + c * (TS + TG) + 4} 8 H${GX + c * (TS + TG) + TS - 4}`)
        .join("")}"/></g>
      ${[RX0 - 2, RX1 - 2]
        .map(
          (x) => `${box(x, 0, 13, 16, 16, 40, 0)}
        <g transform="${FRONT(x, 16, 53)}">${slits(4, 12, 4, 6, 34)}</g>`,
        )
        .join("")}
      ${box(RX0 - 6, 2, 53, RX1 - RX0 + 24, 12, 10, 0)}
      <g transform="${FRONT(RX0 - 6, 14, 63)}">
        <rect id="pg-strip" class="pg-strip" x="${GX - RX0 + 2}" y="3" width="${GW - 4}" height="4" rx="1"/></g>
      <g transform="${SIDE(RX1 + 18, 14, 63)}"><circle id="pg-led" class="led" cx="6" cy="5" r="2.4"/></g>
      <g transform="${TOP(RX0 - 6, 2, 63)}">${slits(8, 20, 4, 2, 10)}${slits(RX1 - RX0 + 4, RX1 - RX0 + 16, 4, 2, 10)}</g></g>`;

    stage.setAttribute("viewBox", K.viewBox);
    stage.innerHTML = svg;
    const $ = (id: string) => stage.querySelector<SVGElement>("#pg-" + id)!;
    const el = tiles.map(({ i }) => ({
      tile: $("t" + i),
      glyph: $("g" + i),
      ghost: stage.querySelector<SVGElement>("#pg-ghost" + i),
      safe: $("safe" + i),
      ring: $("ring" + i),
      ok: $("ok" + i),
      flag: $("f" + i),
      flagText: $("ft" + i),
    }));
    const gantry = $("gantry");

    type Phase = "idle" | "scan" | "flagged" | "fixed";
    const st = {
      phase: "idle" as Phase,
      by: HOME,
      row: -1,
      laser: false,
      ok: tiles.map(() => false),
      flag: tiles.map((): Flag => ""),
      fixed: tiles.map(() => false),
      decided: false,
      seq: 0,
    };
    const count = (f: Flag) => st.flag.filter((x) => x === f).length;
    const nFixed = () => st.fixed.filter(Boolean).length;

    function place() {
      gantry.setAttribute(
        "transform",
        `translate(${(-st.by * C).toFixed(2)} ${(st.by * S).toFixed(2)})`,
      );
    }

    function render() {
      tiles.forEach(({ name, i }) => {
        const e = el[i],
          f = st.flag[i],
          d = DRIFT[name];
        const off = d && !st.fixed[i] ? d : [0, 0];
        e.glyph.style.transform = `translate(${off[0]}px, ${off[1]}px)`;
        e.ghost?.classList.toggle("on", f === "fix");
        e.ring.classList.toggle("on", f !== "");
        e.safe.classList.toggle("hot", f !== "" && name === KEEP);
        e.ok.classList.toggle("on", st.ok[i]);
        e.flag.classList.toggle("on", f !== "");
        e.flag.classList.toggle("pg-keep", f === "keep");
        e.flagText.textContent = f;
        e.tile.classList.toggle("can", f === "fix" && name !== KEEP);
      });
      $("laser").classList.toggle("on", st.laser);
      $("strip").classList.toggle("on", st.phase === "scan");
      $("led").classList.toggle("hot", st.phase === "scan");
      place();
      api.power(st.phase !== "idle");
      const n = st.ok.filter(Boolean).length;
      api.readout(
        st.phase === "idle"
          ? "16 glyphs · space to scan"
          : st.phase === "scan"
            ? `scanning row ${Math.max(1, st.row + 1)}/4 · ${n} checked`
            : st.phase === "flagged"
              ? count("keep")
                ? `16 glyphs · ${count("fix")} to fix · ${count("keep")} kept`
                : `16 glyphs · ${count("fix")} flagged`
              : `16 glyphs · ${nFixed()} fixed · ${count("keep")} kept`,
      );
    }

    // slide the gantry to `to`; a timer finishes the move if frames are throttled
    let cancel: (() => void) | null = null;
    function slide(to: number, ms: number, done: () => void) {
      cancel?.();
      const from = st.by,
        t0 = performance.now();
      let over = false;
      const finish = () => {
        if (over) return;
        over = true;
        stop();
        st.by = to;
        place();
        done();
      };
      const stop = api.loop((now) => {
        if (over) return;
        const k = Math.min(1, (now - t0) / ms),
          e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
        st.by = from + (to - from) * e;
        place();
        if (k >= 1) finish();
      });
      cancel = () => {
        over = true;
        stop();
      };
      api.after(ms + 80, finish);
    }

    function check(i: number) {
      const name = SET[i];
      if (name === KEEP) st.flag[i] = st.decided ? "keep" : "fix";
      else if (DRIFT[name] && !st.fixed[i]) st.flag[i] = "fix";
      else st.ok[i] = true;
      render();
    }

    function scan() {
      const seq = ++st.seq;
      Object.assign(st, { phase: "scan", row: -1, laser: false });
      st.ok.fill(false);
      st.flag.fill("");
      render();
      const row = (r: number) => {
        if (seq !== st.seq) return;
        if (r === 4) {
          st.laser = false;
          render();
          slide(HOME, 650, () => {
            if (seq !== st.seq) return;
            st.phase = count("fix") ? "flagged" : "fixed";
            render();
            // the truck's flag is a decision, not a mistake: keep it
            api.after(650, () => {
              if (seq !== st.seq) return;
              st.flag = st.flag.map((f, i) => (SET[i] === KEEP && f ? "keep" : f));
              st.decided = true;
              render();
            });
          });
          return;
        }
        st.row = r;
        slide(GY + r * (TS + TG) + TS / 2 - 8, r === 0 ? 420 : 300, () => {
          if (seq !== st.seq) return;
          st.laser = true;
          render();
          [0, 1, 2, 3].forEach((c) =>
            api.after(70 + c * 80, () => {
              if (seq === st.seq) check(r * 4 + c);
            }),
          );
          api.after(70 + 4 * 80 + 60, () => row(r + 1));
        });
      };
      api.after(80, () => row(0));
    }

    function fixOne(i: number) {
      if (st.flag[i] !== "fix" || st.phase !== "flagged" || SET[i] === KEEP) return;
      st.flag[i] = "";
      st.fixed[i] = true;
      render();
      api.after(420, () => {
        st.ok[i] = true;
        if (!count("fix")) st.phase = "fixed";
        render();
      });
    }

    function fixAll() {
      st.flag
        .map((f, i) => (f === "fix" ? i : -1))
        .filter((i) => i >= 0)
        .forEach((i, k) => api.after(k * 260, () => fixOne(i)));
    }

    function act() {
      if (st.phase === "scan") return;
      if (st.phase === "flagged" && count("fix")) fixAll();
      else scan();
    }

    function reset() {
      st.seq++;
      cancel?.();
      Object.assign(st, { phase: "idle", row: -1, laser: false, decided: false, by: HOME });
      st.ok.fill(false);
      st.flag.fill("");
      st.fixed.fill(false);
      render();
    }

    gantry.addEventListener("click", act);
    tiles.forEach(({ i }) => el[i].tile.addEventListener("click", () => fixOne(i)));
    render();
    return {
      key: (e) => {
        if (e.key === " " || e.key === "Enter") {
          act();
          return true;
        }
        if (e.key === "r" || e.key === "R") {
          reset();
          return true;
        }
        return false;
      },
      demo: () => api.after(300, act),
    };
  },
};
