// About: a designer who codes. A drawing tablet with a stylus, a laptop that
// shows either the canvas (frames) or the code, and a shop sign that says
// whether Salman is open to new work.
import type { Point3 } from "../kernel";
import type { IsoFig } from "../types";

type V3 = Point3;

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];

const poly = (pts: [number, number][]) =>
  `M${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join("L")}Z`;

// code view: [indent, length, accent] per line
const CODE: [number, number, boolean][] = [
  [0, 34, true],
  [6, 52, false],
  [12, 40, false],
  [12, 62, true],
  [18, 30, false],
  [12, 46, false],
  [6, 22, true],
  [0, 12, false],
];

export const about: IsoFig = {
  id: "ab",
  name: "About",
  hint: "click the sign · space open/closed · c canvas/code",
  aria: "Isometric desk of a designer who codes: a shop sign in a standing frame, a laptop, a drawing tablet with a stylus and a phone on a dock. Click the sign or press space to flip it between open and closed; it lights up when open to new work. Click the laptop or press c to switch its screen between the canvas, with frames, and the code; on code the phone lights with the shipped build.",
  css: `
    [data-fig="ab"] .glass { vector-effect:non-scaling-stroke; }
    [data-fig="ab"] .ab-ink { fill:none; stroke:var(--line); stroke-width:1.4; stroke-linecap:round; vector-effect:non-scaling-stroke; transition:stroke .3s; }
    [data-fig="ab"] .ab-ink.hot { stroke:var(--accent); stroke-width:2; }
    [data-fig="ab"] .ab-ink.draw { stroke-dasharray:1000; animation:ab-draw .9s ease-out; }
    @keyframes ab-draw { from { stroke-dashoffset:1000; } to { stroke-dashoffset:0; } }
    [data-fig="ab"] .ab-tip { fill:var(--detail); stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="ab"] .ab-tip.hot { fill:var(--accent); stroke:var(--accent); }
    [data-fig="ab"] .ab-sign { fill:var(--body); stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; transition:fill .25s; }
    [data-fig="ab"] .ab-sign.hot { fill:var(--accent); stroke:var(--accent); }
    [data-fig="ab"] .ab-word { fill:var(--ink); font-family:var(--mono); }
    [data-fig="ab"] .ab-word.hot { fill:var(--panel); }
    [data-fig="ab"] .ab-frame { fill:none; stroke:var(--accent-hi); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="ab"] .ab-sel { fill:none; stroke:var(--accent); stroke-width:1.4; vector-effect:non-scaling-stroke; }
    [data-fig="ab"] #ab-sign, [data-fig="ab"] #ab-laptop, [data-fig="ab"] #ab-tablet, [data-fig="ab"] #ab-phone { cursor:pointer; }
  `,
  mount(stage, api) {
    /*  parts            x    y    z    w    d    h
        plate            0    0    0  380  216    8
        sign frame      40   84    8    5   92   90   board 76 × 44 on the SIDE plane
        laptop base    130   46    8  148   90    6   screen 96 tall, tilted 12°
        phone dock     310   64    8   46   22    6   phone 34 × 6 × 64
        tablet         168  146    8  108   58    5  */
    const TX = 168,
      TY = 146,
      TW = 108,
      TD = 58,
      TZ = 13;
    const LX = 130,
      LY = 46,
      LW = 148,
      LD = 90,
      LZ = 14;
    const SW = 144,
      SH = 96,
      tilt = (12 * Math.PI) / 180;
    const GX = 40,
      GY = 92,
      GW = 76,
      GH = 44,
      GZ = 36;
    const FX = 316,
      FY = 70,
      FW = 34,
      FD = 6,
      FH = 64;

    // screen: hinge near the back of the base, leaning back
    const hy = LY + 8;
    const sx0 = LX + (LW - SW) / 2;
    const Vd: V3 = [0, Math.sin(tilt), -Math.cos(tilt)]; // down the face
    const N: V3 = [0, Math.cos(tilt), Math.sin(tilt)]; // out of the face
    const topL: V3 = [sx0, hy - SH * Vd[1], LZ + SH * Math.cos(tilt)];

    const K = api.iso.frame([
      [0, 0, 0],
      [380, 0, 0],
      [0, 216, 0],
      [380, 216, 0],
      topL,
      [GX, GY - 8, 98],
    ]);
    const { P, TOP, FRONT, SIDE, plane, box } = K;

    // ground plate, inset line, screws, a printed label
    let svg = box(0, 0, 0, 380, 216, 8, 14);
    svg += `<g transform="${TOP(0, 0, 8)}"><rect class="detail" x="10" y="10" width="360" height="196" rx="8"/>
      ${[
        [18, 18],
        [362, 18],
        [18, 198],
        [362, 198],
      ]
        .map(([x, y]) => `<circle class="detail" cx="${x}" cy="${y}" r="3"/>`)
        .join("")}
      <text class="label" x="292" y="196" font-size="7" opacity=".7">sketch · ship</text></g>`;

    // shop sign: a standing frame, the board hung from the top bar on rings
    const foot = (y: number) => box(GX - 14, y - 2, 8, 33, 10, 5, 3);
    const post = (y: number) => box(GX, y, 13, 5, 6, 80);
    svg += foot(GY - 8) + post(GY - 8);
    svg += `<g id="ab-sign" class="press">${box(GX, GY, GZ, 5, GW, GH)}
      <g transform="${SIDE(GX + 5, GY + GW, GZ + GH)}"><g id="ab-flip">
        <rect id="ab-face" class="ab-sign" x="4" y="4" width="${GW - 8}" height="${GH - 8}" rx="3"/>
        <text id="ab-word" class="ab-word" x="${GW / 2}" y="${GH / 2 + 2}" font-size="16" text-anchor="middle">closed</text>
        <text id="ab-sub" class="ab-word" x="${GW / 2}" y="${GH - 10}" font-size="6.5" text-anchor="middle">back soon</text>
      </g></g></g>`;
    const ring = (y: number) => {
      const [x0, y0] = P(GX + 2.5, y, GZ + GH);
      const [, y1] = P(GX + 2.5, y, 93);
      return `<ellipse class="detail" cx="${x0}" cy="${(y0 + y1) / 2}" rx="2.2" ry="${(y0 - y1) / 2 + 1}"/>`;
    };
    svg += ring(GY + 10) + ring(GY + GW - 10);
    svg += foot(GY + GW + 2) + post(GY + GW + 2);
    svg += box(GX, GY - 8, 93, 5, GW + 16, 5);

    // laptop: base with keys and trackpad, then the tilted screen
    svg += `<g id="ab-laptop">${box(LX, LY, 8, LW, LD, LZ - 8, 5)}
      <g transform="${TOP(LX, LY, LZ)}">
        <rect class="face recess" x="12" y="14" width="${LW - 24}" height="40" rx="2"/>
        ${Array.from({ length: 4 }, (_, r) =>
          Array.from({ length: 13 }, (_, c) => {
            const w = (LW - 30) / 13;
            return `<rect class="face top" x="${15 + c * w}" y="${17 + r * 9}" width="${w - 2}" height="7" rx="1"/>`;
          }).join(""),
        ).join("")}
        <rect class="face recess" x="${LW / 2 - 24}" y="60" width="48" height="26" rx="2"/></g>`;
    const F1a = topL;
    const F1b: V3 = [sx0 + SW, topL[1], topL[2]];
    const F0b: V3 = [sx0 + SW, hy, LZ];
    const back = (p: V3) => add(p, mul(N, -4));
    const quad = (pts: V3[]) => `<path class="face" d="${poly(pts.map((p) => P(...p)))}"/>`;
    svg += quad([F1b, F0b, back(F0b), back(F1b)]);
    svg += quad([F1a, F1b, back(F1b), back(F1a)]);
    svg += `<g transform="${plane(topL, [1, 0, 0], Vd)}">
      <rect class="face" width="${SW}" height="${SH}" rx="3"/>
      <clipPath id="ab-clip"><rect x="7" y="7" width="${SW - 14}" height="${SH - 16}" rx="2"/></clipPath>
      <rect id="ab-glass" class="glass" x="7" y="7" width="${SW - 14}" height="${SH - 16}" rx="2"/>
      <g id="ab-scr" clip-path="url(#ab-clip)"></g>
      <circle class="detail" cx="${SW / 2}" cy="${SH - 4.5}" r="1.4"/></g></g>`;

    // drawing tablet with an active area, express keys and a stroke
    const INK = "M12 40 C20 14 36 12 42 30 S60 52 70 22";
    svg += `<g id="ab-tablet">${box(TX, TY, 8, TW, TD, TZ - 8, 6)}
      <g transform="${TOP(TX, TY, TZ)}">
        <rect class="face recess" x="8" y="8" width="80" height="${TD - 16}" rx="2"/>
        ${[0, 1, 2, 3].map((i) => `<rect class="detail" x="94" y="${12 + i * 11}" width="8" height="7" rx="1.5"/>`).join("")}
        ${[
          [8, 8],
          [88, 8],
          [8, TD - 8],
          [88, TD - 8],
        ]
          .map(([x, y]) => `<circle class="detail" cx="${x}" cy="${y}" r="1"/>`)
          .join("")}
        <path id="ab-ink" class="ab-ink" pathLength="1000" d="${INK}" transform="translate(8 8)"/></g>`;
    // stylus: tip on the end of the stroke, leaning back toward the user
    const tip: V3 = [TX + 8 + 70, TY + 8 + 22, TZ];
    const end = add(tip, [10, 30, 64]);
    const along = (k: number) => add(tip, mul(add(end, mul(tip, -1)), k));
    const [ax, ay] = P(...tip);
    const [bx, by] = P(...end);
    const l = Math.hypot(bx - ax, by - ay);
    const nx = -(by - ay) / l;
    const ny = (bx - ax) / l;
    const at = (k: number, w: number): [number, number][] => {
      const [x, y] = P(...along(k));
      return [
        [x + nx * w, y + ny * w],
        [x - nx * w, y - ny * w],
      ];
    };
    const [c0, c1] = at(0.14, 3.2);
    const [e0, e1] = at(1, 3.2);
    const [m0, m1] = at(0.7, 3.2);
    svg += `<path class="face" d="${poly([[ax, ay], c0, e0, e1, c1])}"/>
      <path id="ab-tip" class="ab-tip" d="${poly([[ax, ay], c0, c1])}"/>
      <path class="detail" d="M${m0.join(" ")}L${m1.join(" ")}"/>
      <ellipse class="face" cx="${(e0[0] + e1[0]) / 2}" cy="${(e0[1] + e1[1]) / 2}" rx="3.2" ry="2"/></g>`;

    // phone on a dock: the shipped build, lit while the laptop is on code
    svg += box(FX - 6, FY - 6, 8, FW + 12, 22, 6, 4);
    svg += `<g id="ab-phone">${box(FX, FY, 14, FW, FD, FH, 3)}
      <g transform="${FRONT(FX, FY + FD, 14 + FH)}">
        <rect class="detail" x="${FW / 2 - 5}" y="3" width="10" height="1.6" rx=".8"/>
        <rect id="ab-pglass" class="glass" x="3" y="7" width="${FW - 6}" height="${FH - 13}" rx="3"/>
        <g id="ab-app"></g></g></g>`;

    stage.setAttribute("viewBox", K.viewBox);
    stage.innerHTML = svg;
    const $ = (id: string) => stage.querySelector<SVGElement>("#ab-" + id)!;

    const st = {
      open: false,
      mode: "canvas" as "canvas" | "code",
      lines: CODE.length,
      typing: 0,
      flipping: false,
    };

    function screen() {
      const x0 = 7,
        y0 = 7,
        w = SW - 14;
      const tab = (x: number, name: string) => {
        const on = st.mode === name;
        return `<text class="${on ? "scr-accent" : "scr"}" x="${x}" y="${y0 + 9}" font-size="6.5" opacity="${on ? 1 : 0.7}">${name}</text>
          ${on ? `<rect class="scr-accent" x="${x}" y="${y0 + 11.5}" width="${name.length * 3.9}" height="1.2"/>` : ""}`;
      };
      let s = `${tab(x0 + 6, "canvas")}${tab(x0 + 40, "code")}
        <rect class="scr" x="${x0}" y="${y0 + 15}" width="${w}" height=".6" opacity=".6"/>`;
      if (st.mode === "canvas") {
        const top = y0 + 22;
        // three frames: phone, desktop (selected), tablet
        s += `<rect class="ab-frame" x="${x0 + 8}" y="${top}" width="24" height="48" rx="3"/>
          <rect class="scr" x="${x0 + 12}" y="${top + 6}" width="16" height="10" rx="1" opacity=".55"/>
          <rect class="scr" x="${x0 + 12}" y="${top + 20}" width="16" height="2.4" opacity=".7"/>
          <rect class="scr" x="${x0 + 12}" y="${top + 25}" width="11" height="2.4" opacity=".7"/>
          <rect class="ab-frame" x="${x0 + 40}" y="${top}" width="58" height="40" rx="1"/>
          <rect class="scr" x="${x0 + 45}" y="${top + 5}" width="22" height="3" opacity=".8"/>
          <rect class="scr" x="${x0 + 45}" y="${top + 12}" width="48" height="12" rx="1" opacity=".45"/>
          <path class="ab-sel" d="M${x0 + 50} ${top + 34} C${x0 + 56} ${top + 26} ${x0 + 64} ${top + 26} ${x0 + 68} ${top + 32} S${x0 + 82} ${top + 36} ${x0 + 88} ${top + 28}"/>
          <rect class="ab-sel" x="${x0 + 38}" y="${top - 2}" width="62" height="44"/>
          ${[
            [38, -2],
            [100, -2],
            [38, 42],
            [100, 42],
          ]
            .map(
              ([dx, dy]) =>
                `<rect class="scr-accent" x="${x0 + dx - 2}" y="${top + dy - 2}" width="4" height="4"/>`,
            )
            .join("")}
          <rect class="ab-frame" x="${x0 + 106}" y="${top}" width="20" height="30" rx="2"/>
          <rect class="scr" x="${x0 + 109}" y="${top + 4}" width="14" height="8" rx="1" opacity=".55"/>
          <text class="scr" x="${x0 + 40}" y="${top + 52}" font-size="6" opacity=".8">frame 2 · 1440</text>`;
      } else {
        const top = y0 + 25;
        CODE.slice(0, st.lines).forEach(([ind, len, acc], i) => {
          const y = top + i * 7;
          s += `<rect class="scr" x="${x0 + 5}" y="${y}" width="4" height="2.6" opacity=".45"/>
            <rect class="${acc ? "scr-accent" : "scr"}" x="${x0 + 16 + ind}" y="${y}" width="${len}" height="2.6" rx="1.3"/>`;
        });
        const last = CODE[Math.max(0, st.lines - 1)];
        const cy = top + Math.max(0, st.lines - 1) * 7 - 1;
        s += `<rect class="scr-accent blink" x="${x0 + 18 + last[0] + last[1]}" y="${cy}" width="2.4" height="5"/>`;
      }
      return s;
    }

    function render() {
      const canvas = st.mode === "canvas";
      $("glass").classList.add("hot");
      $("scr").innerHTML = screen();
      $("pglass").classList.toggle("hot", !canvas);
      $("app").innerHTML = canvas
        ? ""
        : `<rect class="scr" x="7" y="12" width="12" height="2.4" rx="1"/>
          <rect class="scr" x="7" y="18" width="${FW - 14}" height="15" rx="2" opacity=".5"/>
          <rect class="scr" x="7" y="37" width="${FW - 16}" height="2" rx="1"/>
          <rect class="scr" x="7" y="42" width="12" height="2" rx="1"/>
          <rect class="scr-accent" x="7" y="49" width="${FW - 14}" height="6" rx="3"/>`;
      $("ink").classList.toggle("hot", canvas);
      $("tip").classList.toggle("hot", canvas);
      $("face").classList.toggle("hot", st.open);
      $("word").classList.toggle("hot", st.open);
      $("sub").classList.toggle("hot", st.open);
      $("word").textContent = st.open ? "open" : "closed";
      $("word").setAttribute("font-size", st.open ? "19" : "15");
      $("sub").textContent = st.open ? "to new work" : "back soon";
      api.power(st.open);
      api.readout(`${st.open ? "open to new work" : "closed"} · ${st.mode}`);
    }

    // flip the sign on its rings: squash, swap the face, open out again
    function sign() {
      if (st.flipping) return;
      st.flipping = true;
      const flip = $("flip");
      const t0 = performance.now();
      const stop = api.loop((t) => {
        const k = Math.min(1, (t - t0) / 260);
        const s = Math.abs(Math.cos(k * Math.PI)).toFixed(3);
        flip.setAttribute(
          "transform",
          `translate(${GW / 2} 0) scale(${s} 1) translate(${-GW / 2} 0)`,
        );
      });
      api.after(130, () => {
        st.open = !st.open;
        render();
      });
      api.after(260, () => {
        stop();
        flip.removeAttribute("transform");
        st.flipping = false;
      });
    }

    function mode(next?: "canvas" | "code") {
      st.mode = next ?? (st.mode === "canvas" ? "code" : "canvas");
      const run = ++st.typing;
      if (st.mode === "canvas") {
        api.replay($("ink"), "draw");
      } else {
        $("ink").classList.remove("draw");
        // type the code in, line by line
        st.lines = 1;
        CODE.forEach((_, i) =>
          api.after(i * 70, () => {
            if (run !== st.typing) return;
            st.lines = i + 1;
            render();
          }),
        );
      }
      render();
    }

    $("sign").addEventListener("click", sign);
    $("laptop").addEventListener("click", () => mode());
    $("tablet").addEventListener("click", () => mode("canvas"));
    $("phone").addEventListener("click", () => mode("code"));
    render();
    return {
      key: (e) => {
        if (e.key === " " || e.key === "Enter") {
          sign();
          return true;
        }
        if (e.key === "c" || e.key === "C") {
          mode();
          return true;
        }
        return false;
      },
      demo: () => {
        api.after(150, () => mode("canvas"));
        api.after(1200, () => mode("code"));
        api.after(2000, sign);
      },
    };
  },
};
