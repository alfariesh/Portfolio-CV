// Rekanesia: one token source (tokens.json) re-skins the same stepper and
// button on a design canvas, a web page and a phone. Five brands without new
// hues: solid, outline, hatched and soft accent fills, different corner radii
// and labels. The stepper presets are real bag sizes, 50 kg and 30 kg.
import type { IsoFig } from "../types";

type Skin = "solid" | "line" | "hatch" | "soft";
type Brand = { skin: Skin; r: number; cta: string };
type Box4 = [x: number, y: number, w: number, h: number];

const BRANDS: Brand[] = [
  { skin: "solid", r: 1, cta: "order" },
  { skin: "line", r: 9, cta: "buy" },
  { skin: "hatch", r: 3, cta: "add" },
  { skin: "solid", r: 9, cta: "get" },
  { skin: "soft", r: 0, cta: "checkout" },
];

// stepper and button boxes on each surface's face, plus a font size
const KITS: { st: Box4; bt: Box4; c: number; fs: number }[] = [
  { st: [46, 26, 84, 17], bt: [60, 70, 56, 17], c: 17, fs: 8.5 },
  { st: [22, 30, 86, 19], bt: [34, 59, 62, 19], c: 19, fs: 9 },
  { st: [8, 40, 44, 17], bt: [8, 66, 44, 17], c: 12, fs: 7 },
];

export const rekanesia: IsoFig = {
  id: "rk",
  name: "Rekanesia",
  hint: "click the tokens · space next brand · 1–5 pick · ↑↓ preset",
  aria: "Isometric token source labelled tokens.json wired to a design canvas, a browser window and a phone, each showing the same stepper and button. Click the tokens block or press space to switch to the next of five brands, or press 1 to 5 to pick one: a pulse runs down each wire and each surface re-skins in turn. Click a stepper or press up and down to switch the bag preset between 50 kg and 30 kg on all three at once.",
  css: `
    [data-fig="rk"] .glass { vector-effect:non-scaling-stroke; }
    [data-fig="rk"] .rk-fr { fill:none; stroke:var(--line); stroke-width:1; stroke-dasharray:2 2; vector-effect:non-scaling-stroke; }
    [data-fig="rk"] .rk-box { fill:var(--panel); stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="rk"] .rk-off { fill:var(--deck); stroke:var(--detail); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="rk"] .rk-solid { fill:var(--accent); stroke:var(--accent); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="rk"] .rk-line { fill:var(--panel); stroke:var(--accent); stroke-width:1.8; vector-effect:non-scaling-stroke; }
    [data-fig="rk"] .rk-hatch { stroke:var(--accent); stroke-width:1.2; vector-effect:non-scaling-stroke; }
    [data-fig="rk"] .rk-soft { fill:var(--accent-hi); stroke:var(--accent-hi); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="rk"] .rk-hd { fill:var(--panel); stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="rk"] .rk-hd.on { stroke:var(--accent); fill:var(--accent); }
    [data-fig="rk"] .rk-tg { fill:var(--line); }
    [data-fig="rk"] .rk-tk { fill:var(--ink-hi); }
    [data-fig="rk"] .rk-tp { fill:var(--panel); }
    [data-fig="rk"] .rk-ta { fill:var(--accent); }
    [data-fig="rk"] .rk-step { cursor:pointer; }
    [data-fig="rk"] .rk-in { animation:rk-in .45s ease-out; }
    @keyframes rk-in { from { opacity:.1; } }
    @media (prefers-reduced-motion: reduce) { [data-fig="rk"] .rk-in { animation:none; } }
  `,
  mount(stage, api) {
    const K = api.iso.frame([
      [0, 0, 0],
      [450, 0, 0],
      [0, 250, 0],
      [450, 250, 0],
      [28, 34, 118],
      [358, 38, 126],
      [36, 136, 64],
    ]);
    const { TOP, FRONT, SIDE, box } = K;
    const { slits, esc } = api.iso;

    let svg = `<defs><pattern id="rk-hatch" patternUnits="userSpaceOnUse" width="3.4" height="3.4" patternTransform="rotate(45)">
      <rect width="3.4" height="3.4" style="fill:var(--panel)"/>
      <line x1="0.8" y1="0" x2="0.8" y2="3.4" style="stroke:var(--accent);stroke-width:1.6"/></pattern></defs>`;

    // ground plate, printed platform labels
    svg += box(0, 0, 0, 450, 250, 8, 14);
    svg += `<g transform="${TOP(0, 0, 8)}"><rect class="detail" x="10" y="10" width="430" height="230" rx="8"/>
      ${[
        [18, 18],
        [432, 18],
        [18, 232],
        [432, 232],
      ]
        .map(([x, y]) => `<circle class="detail" cx="${x}" cy="${y}" r="3"/>`)
        .join("")}
      <text class="label" x="108" y="69" font-size="9">design</text>
      <text class="label" x="279" y="83" font-size="9">web</text>
      <text class="label" x="396" y="75" font-size="9">native</text>
      <text class="label" x="186" y="224" font-size="9" text-anchor="end">brand</text></g>`;

    // one wire per platform, all from the token source
    const WIRES = [
      "M100 136 V52",
      "M120 160 H263 Q271 160 271 152 V66",
      "M120 184 H380 Q388 184 388 176 V58",
    ];
    svg += `<g transform="${TOP(0, 0, 8)}">${WIRES.map(
      (d, i) =>
        `<path class="wire-under" d="${d}"/><path id="rk-w${i}" class="wire" d="${d}"/><path id="rk-p${i}" class="pulse" pathLength="1000" d="${d}"/>`,
    ).join("")}</g>`;

    // design canvas: a board on a base, layers panel and two frames
    svg += box(20, 28, 8, 166, 24, 6, 3);
    svg += box(28, 34, 14, 150, 10, 104, 3);
    svg += `<g transform="${FRONT(28, 44, 118)}">
      <rect id="rk-g0" class="glass" x="6" y="6" width="138" height="92" rx="2"/>
      <rect class="face recess" x="6" y="6" width="22" height="92" rx="2"/>
      ${slits(16, 70, 9, 11, 23, false)}
      <text class="label" x="38" y="20" font-size="6.5">stepper</text>
      <rect class="rk-fr" x="38" y="22" width="100" height="25"/>
      <text class="label" x="38" y="62" font-size="6.5">button</text>
      <rect class="rk-fr" x="38" y="66" width="100" height="25"/>
      <g id="rk-s0"></g></g>`;

    // web: a monitor on a foot and neck
    svg += box(238, 24, 8, 66, 42, 5, 5);
    svg += box(265, 30, 13, 12, 8, 10);
    svg += box(206, 36, 22, 130, 8, 92, 3);
    svg += `<g transform="${FRONT(206, 44, 114)}">
      <rect id="rk-g1" class="glass" x="5" y="5" width="120" height="82" rx="2"/>
      <rect class="face recess" x="5" y="5" width="120" height="13" rx="2"/>
      ${[12, 19, 26].map((x) => `<circle class="detail" cx="${x}" cy="11.5" r="2"/>`).join("")}
      <rect class="detail" x="36" y="8" width="72" height="7" rx="3.5"/>
      <g id="rk-s1"></g></g>`;

    // native: a phone in a dock
    svg += box(350, 30, 8, 76, 28, 6, 4);
    svg += box(358, 38, 14, 60, 10, 112, 5);
    svg += `<g transform="${FRONT(358, 48, 126)}">
      <rect class="detail" x="23" y="4" width="14" height="2" rx="1"/>
      <rect id="rk-g2" class="glass" x="5" y="10" width="50" height="92" rx="4"/>
      <rect class="detail" x="10" y="18" width="40" height="16" rx="2"/>
      <g id="rk-s2"></g>
      <rect class="detail" x="22" y="106" width="16" height="2" rx="1"/></g>`;

    // the token source: one json file, clickable
    svg += `<g class="press" id="rk-cube">${box(36, 136, 8, 84, 84, 56, 6)}
      <g transform="${TOP(36, 136, 64)}"><rect class="detail" x="9" y="9" width="66" height="66" rx="4"/>
        <text class="label" x="42" y="50" font-size="22" text-anchor="middle">{ }</text></g>
      <g transform="${FRONT(36, 220, 64)}">
        <text class="label" x="10" y="15" font-size="8.5">tokens.json</text>
        <line class="detail" x1="10" y1="20" x2="74" y2="20"/>
        <text id="rk-val" class="label" x="10" y="35" font-size="10">"brand": 1</text>
        ${BRANDS.map((_, k) => `<circle id="rk-pip${k}" class="led" cx="${14 + k * 9}" cy="45" r="2.6"/>`).join("")}</g>
      <g transform="${SIDE(120, 220, 64)}">
        ${(
          [
            [10, 58],
            [18, 70],
            [18, 50],
            [10, 34],
          ] as [number, number][]
        )
          .map(
            ([a, b], k) =>
              `<line class="detail" x1="${a}" y1="${12 + k * 8}" x2="${b}" y2="${12 + k * 8}"/>`,
          )
          .join("")}
        ${[36, 60].map((x) => `<rect class="face recess" x="${x - 4}" y="44" width="8" height="8" rx="1"/>`).join("")}</g></g>`;

    // brand keys on the plate
    BRANDS.forEach((_, i) => {
      const x = 196 + i * 42;
      svg += `<g class="press" id="rk-k${i}">${box(x, 204, 8, 32, 28, 7, 5)}
        <g transform="${TOP(x, 204, 15)}"><text class="label" x="16" y="18" font-size="11" text-anchor="middle">${i + 1}</text></g></g>`;
    });

    stage.setAttribute("viewBox", K.viewBox);
    stage.innerHTML = svg;
    const $ = (id: string) => stage.querySelector<SVGElement>("#rk-" + id)!;
    const cube = $("cube");
    const keys = BRANDS.map((_, i) => $("k" + i));
    const pips = BRANDS.map((_, i) => $("pip" + i));
    const glass = [0, 1, 2].map((i) => $("g" + i));
    const scr = [0, 1, 2].map((i) => $("s" + i));
    const wires = [0, 1, 2].map((i) => $("w" + i));
    const pulses = [0, 1, 2].map((i) => $("p" + i));

    const st = {
      on: false,
      brand: 0,
      kg: 50,
      // brand shown on each surface; -1 until the first sync reaches it
      shown: [-1, -1, -1],
      hot: [0, 0, 0],
    };

    const skin = (b: Brand, on: boolean) => (on ? `rk-${b.skin}` : "rk-off");
    const ink = (b: Brand, on: boolean) =>
      !on ? "rk-tg" : b.skin === "solid" ? "rk-tp" : b.skin === "line" ? "rk-ta" : "rk-tk";
    const fill = (b: Brand, on: boolean) =>
      on && b.skin === "hatch" ? ` fill="url(#rk-hatch)"` : "";

    function kit(i: number) {
      const on = st.shown[i] >= 0;
      const b = BRANDS[Math.max(0, st.shown[i])];
      const { st: s, bt, c, fs } = KITS[i];
      const base = (h: number) => fs * 0.36 + h / 2;
      // stepper: two square end cells in the brand skin, the preset between
      const [x, y, w, h] = s;
      const r = Math.min(b.r, h / 2);
      const ri = Math.max(0, Math.min(r, c / 2) - 2);
      const cell = (cx: number) =>
        `<rect class="${skin(b, on)}"${fill(b, on)} x="${cx + 2}" y="${y + 2}" width="${c - 4}" height="${h - 4}" rx="${ri}"/>`;
      let out = `<g class="rk-step"><rect class="${on ? "rk-box" : "rk-off"}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>
        ${cell(x)}${cell(x + w - c)}
        <text class="${ink(b, on)}" x="${x + c / 2}" y="${y + base(h) + 0.5}" font-size="${fs + 2}" text-anchor="middle">−</text>
        <text class="${ink(b, on)}" x="${x + w - c / 2}" y="${y + base(h) + 0.5}" font-size="${fs + 2}" text-anchor="middle">+</text>
        <text class="${on ? "rk-tk" : "rk-tg"}" x="${x + w / 2}" y="${y + base(h)}" font-size="${fs}" text-anchor="middle">${st.kg} kg</text></g>`;
      // call to action button
      const [bx, by, bw, bh] = bt;
      out += `<rect class="${skin(b, on)}"${fill(b, on)} x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="${Math.min(b.r, bh / 2)}"/>
        <text class="${ink(b, on)}" x="${bx + bw / 2}" y="${by + base(bh)}" font-size="${fs}" text-anchor="middle">${esc(b.cta)}</text>`;
      // the design canvas shows selection handles on the button frame
      if (i === 0)
        out += [
          [38, 66],
          [138, 66],
          [38, 91],
          [138, 91],
        ]
          .map(
            ([hx, hy]) =>
              `<rect class="rk-hd${on ? " on" : ""}" x="${hx - 2}" y="${hy - 2}" width="4" height="4"/>`,
          )
          .join("");
      return out;
    }

    function render() {
      scr.forEach((el, i) => (el.innerHTML = kit(i)));
      glass.forEach((g, i) => g.classList.toggle("hot", st.shown[i] >= 0));
      wires.forEach((w, i) => w.classList.toggle("hot", st.hot[i] > 0));
      keys.forEach((k, i) => k.classList.toggle("latched", st.on && i === st.brand));
      pips.forEach((p, i) => p.classList.toggle("hot", st.on && i === st.brand));
      $("val").innerHTML =
        `"brand": <tspan class="${st.on ? "rk-ta" : ""}">${st.brand + 1}</tspan>`;
      api.power(st.on);
      const done = st.shown.filter((s) => s === st.brand).length;
      const n = `brand ${st.brand + 1}/${BRANDS.length}`;
      api.readout(
        !st.on
          ? "tokens idle · space to sync brand 1"
          : done < 3
            ? `${n} · syncing ${done}/3 platforms`
            : `${n} · ${st.kg} kg · 3 platforms · 0 components changed`,
      );
    }

    // one change at the source: a pulse down each wire, surfaces re-skin in turn
    function sync() {
      st.on = true;
      api.flash(cube, 220);
      [0, 1, 2].forEach((i) =>
        api.after(i * 170, () => {
          st.hot[i]++;
          api.replay(pulses[i]);
          render();
          api.after(540, () => {
            st.shown[i] = st.brand;
            render();
            api.replay(scr[i], "rk-in");
          });
          api.after(1200, () => {
            st.hot[i]--;
            render();
          });
        }),
      );
      render();
    }

    function next() {
      if (st.on) st.brand = (st.brand + 1) % BRANDS.length;
      sync();
    }

    function pick(i: number) {
      st.brand = i;
      api.flash(keys[i]);
      sync();
    }

    // the stepper preset lives in the component, so all platforms follow at once
    function preset(kg?: number) {
      st.kg = kg ?? (st.kg === 50 ? 30 : 50);
      render();
      scr.forEach((el) => api.replay(el.querySelector(".rk-step"), "rk-in"));
    }

    cube.addEventListener("click", next);
    keys.forEach((k, i) => k.addEventListener("click", () => pick(i)));
    scr.forEach((el) =>
      el.addEventListener("click", (e) => {
        if ((e.target as Element).closest(".rk-step")) preset();
      }),
    );
    render();

    return {
      key: (e) => {
        if (e.key === " " || e.key === "Enter") {
          next();
          return true;
        }
        if (e.key >= "1" && e.key <= "5") {
          pick(Number(e.key) - 1);
          return true;
        }
        if (e.key === "ArrowUp") {
          preset(50);
          return true;
        }
        if (e.key === "ArrowDown") {
          preset(30);
          return true;
        }
        return false;
      },
      demo: () => {
        api.after(200, next);
        api.after(1500, next);
        api.after(2700, () => preset(30));
        api.after(3300, next);
        api.after(4500, next);
      },
    };
  },
};
