// Rebuilding this site in an afternoon: a desk clock drives four stage keys
// (design, build, check, ship) and the laptop screen follows the hour, from
// canvas frames at 1 pm to "shipped" at 4 pm.
import type { Point3 } from "../kernel";
import type { IsoFig } from "../types";

const STAGES = ["design", "build", "check", "ship"] as const;

// code lines on the build screen: indent, keyword width, rest width
const CODE: [indent: number, a: number, b: number][] = [
  [0, 14, 34],
  [1, 10, 48],
  [2, 18, 30],
  [2, 12, 40],
  [1, 6, 0],
  [1, 16, 42],
  [2, 22, 26],
  [1, 6, 0],
  [0, 4, 0],
];
const CHECKS = ["format", "lint", "types", "tests"];

export const rebuild: IsoFig = {
  id: "rb",
  name: "An afternoon",
  hint: "click the clock · space next hour · r resets",
  aria: "Isometric desk with a clock, a laptop and four stage keys labelled design, build, check and ship. Click the clock or press space to advance one hour from 1 pm to 4 pm: the hour hand moves, the next stage key lights and the laptop screen changes from canvas frames to code, then checks, then shipped. Press r to reset to 1 pm.",
  css: `
    [data-fig="rb"] .glass { vector-effect:non-scaling-stroke; }
    [data-fig="rb"] .rb-dial { fill:var(--deck); stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="rb"] .rb-tick { stroke:var(--ink); stroke-width:1.2; vector-effect:non-scaling-stroke; stroke-linecap:round; }
    [data-fig="rb"] .rb-hand { fill:var(--ink-hi); }
    [data-fig="rb"] .rb-sec { fill:var(--accent); opacity:.3; }
    [data-fig="rb"] .rb-lab { fill:var(--ink); transition:fill .3s; }
    [data-fig="rb"] .rb-lab.on { fill:var(--ink-hi); font-weight:600; }
    [data-fig="rb"] .rb-t { fill:var(--ink-hi); font-family:var(--mono); }
    [data-fig="rb"] .rb-a { fill:var(--accent); }
    [data-fig="rb"] .rb-ok { fill:none; stroke:var(--panel); stroke-linecap:round; stroke-linejoin:round; }
    [data-fig="rb"] .rb-frame { fill:var(--panel); stroke:var(--accent); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="rb"] .rb-frame.on { fill:var(--accent-hi); stroke-width:2; }
    [data-fig="rb"] .rb-ring { fill:none; stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="rb"] #rb-clock { cursor:pointer; }
    [data-fig="rb"] .rb-coffee { fill:var(--ink); opacity:.55; transition:transform .9s ease-in-out; }
  `,
  mount(stage, api) {
    // plate, clock, laptop base and lid, stage rail
    const PW = 424,
      PD = 244;
    const CX = 26,
      CY = 70,
      CW = 84,
      CD = 44,
      CH = 96;
    const LX = 150,
      LY = 26,
      LW = 172,
      LD = 104,
      LH = 7;
    const RX = 56,
      RY = 176,
      RW = 350,
      RD = 40,
      RH = 22;
    const KW = 64,
      KD = 26,
      KY = RY + 7;
    const KX = [0, 1, 2, 3].map((i) => RX + 18 + i * 82);
    // laptop lid, hinged at the back of the base and tilted 13° back
    const tilt = (13 * Math.PI) / 180,
      sn = Math.sin(tilt),
      cs = Math.cos(tilt);
    const HY = LY + 7,
      HZ = 8 + LH,
      LL = 104,
      LX0 = LX + 6,
      LWW = LW - 12,
      TH = 4;
    const TY = HY - LL * sn,
      TZ = HZ + LL * cs;
    const backY = (y: number) => y - TH * cs,
      backZ = (z: number) => z - TH * sn;

    const K = api.iso.frame(
      [
        [0, 0, 0],
        [PW, 0, 0],
        [0, PD, 0],
        [PW, PD, 0],
        [CX, CY, 8 + CH],
        [CX + 26, CY + 12, 8 + CH + 6],
        [LX0, backY(TY), TZ],
        [LX0 + LWW, backY(TY), TZ],
      ],
      0.06,
    );
    const { TOP, FRONT, SIDE, box, plane, path } = K;
    const { slits } = api.iso;
    const poly = (pts: Point3[], cls: string) => `<path class="${cls}" d="${path(pts)}Z"/>`;

    // ground plate, inset line, screws
    let svg = box(0, 0, 0, PW, PD, 8, 14);
    svg += `<g transform="${TOP(0, 0, 8)}"><rect class="detail" x="10" y="10" width="${PW - 20}" height="${PD - 20}" rx="8"/>
      ${[
        [18, 18],
        [PW - 18, 18],
        [18, PD - 18],
        [PW - 18, PD - 18],
      ]
        .map(([x, y]) => `<circle class="detail" cx="${x}" cy="${y}" r="3"/>`)
        .join("")}</g>`;

    // tick wire: clock → front of the stage rail
    const WD = `M44 ${CY + CD - 2} V${RY + RD - 2} Q44 ${RY + RD + 6} 52 ${RY + RD + 6} H${RX + 10} V${RY + RD}`;
    svg += `<g transform="${TOP(0, 0, 8)}"><path class="wire-under" d="${WD}"/><path id="rb-wire" class="wire" d="${WD}"/>
      <path id="rb-pw" class="pulse" pathLength="1000" d="${WD}"/></g>`;

    // desk clock: body, snooze button, dial with hands
    svg += `<g id="rb-clock">${box(CX, CY, 8, CW, CD, CH, 6)}
      <g class="press" id="rb-btn">${box(CX + 26, CY + 12, 8 + CH, 32, 20, 6, 3)}</g>
      <g transform="${FRONT(CX, CY + CD, 8 + CH)}">
        <circle class="face" cx="42" cy="44" r="37"/>
        <circle class="rb-dial" cx="42" cy="44" r="33"/>
        <path id="rb-sec" class="rb-sec" d=""/>
        ${Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6,
            r0 = i % 3 === 0 ? 24 : 27;
          const x = (r: number) => (42 + r * Math.sin(a)).toFixed(2),
            y = (r: number) => (44 - r * Math.cos(a)).toFixed(2);
          return `<line class="rb-tick" x1="${x(r0)}" y1="${y(r0)}" x2="${x(30)}" y2="${y(30)}"/>`;
        }).join("")}
        ${[1, 2, 3, 4]
          .map((h) => {
            const a = (h * Math.PI) / 6;
            return `<circle id="rb-m${h - 1}" class="led" cx="${(42 + 19 * Math.sin(a)).toFixed(2)}" cy="${(44 - 19 * Math.cos(a)).toFixed(2)}" r="2.4"/>`;
          })
          .join("")}
        <text class="label" x="42" y="64" font-size="7" text-anchor="middle">pm</text>
        <g id="rb-mh"><polygon class="rb-hand" points="-1.4,5 1.4,5 0.7,-27 -0.7,-27"/></g>
        <g id="rb-hh"><polygon class="rb-hand" points="-2.4,4 2.4,4 1.3,-18 -1.3,-18"/></g>
        <circle class="rb-hand" cx="42" cy="44" r="3.2"/>
        <rect class="detail" x="30" y="86" width="24" height="2" rx="1"/></g>
      <g transform="${SIDE(CX + CW, CY + CD, 8 + CH)}">${slits(12, 32, 5, 20, 70)}</g></g>`;

    // laptop base: keyboard and trackpad
    svg += box(LX, LY, 8, LW, LD, LH, 5);
    svg += `<g transform="${TOP(LX, LY, 8 + LH)}">
      ${[0, 1, 2, 3]
        .map((r) =>
          Array.from(
            { length: 13 },
            (_, c) =>
              `<rect class="detail" x="${22 + c * 10}" y="${18 + r * 10}" width="8.4" height="7.4" rx="1.2"/>`,
          ).join(""),
        )
        .join("")}
      <rect class="detail" x="62" y="64" width="48" height="28" rx="3"/></g>`;
    svg += `<g transform="${FRONT(LX, LY + LD, 8 + LH)}"><rect class="detail" x="${LW / 2 - 12}" y="2" width="24" height="2" rx="1"/></g>`;
    // lid: right edge, top edge, then the screen face
    svg += poly(
      [
        [LX0 + LWW, HY, HZ],
        [LX0 + LWW, TY, TZ],
        [LX0 + LWW, backY(TY), backZ(TZ)],
        [LX0 + LWW, backY(HY), HZ],
      ],
      "face",
    );
    svg += poly(
      [
        [LX0, TY, TZ],
        [LX0 + LWW, TY, TZ],
        [LX0 + LWW, backY(TY), backZ(TZ)],
        [LX0, backY(TY), backZ(TZ)],
      ],
      "face top",
    );
    svg += `<g transform="${plane([LX0, TY, TZ], [1, 0, 0], [0, sn, -cs])}">
      <clipPath id="rb-clip"><rect x="7" y="7" width="${LWW - 14}" height="82" rx="2"/></clipPath>
      <rect class="face" width="${LWW}" height="${LL}" rx="3"/>
      <circle class="detail" cx="${LWW / 2}" cy="3.6" r="1.3"/>
      <rect id="rb-glass" class="glass" x="7" y="7" width="${LWW - 14}" height="82" rx="2"/>
      <g id="rb-scr" clip-path="url(#rb-clip)"></g>
      <rect class="detail" x="${LWW / 2 - 14}" y="95" width="28" height="2" rx="1"/></g>`;

    // the afternoon's coffee: the level drops an hour at a time
    const MX = 382,
      MY = 112,
      MR = 17,
      MZ = 8 + 34;
    const ring = (z: number, a0: number, a1: number, n: number) =>
      Array.from({ length: n + 1 }, (_, i): Point3 => {
        const a = a0 + ((a1 - a0) * i) / n;
        return [MX + MR * Math.cos(a), MY + MR * Math.sin(a), z];
      });
    const q = Math.PI / 4;
    svg += poly([...ring(8, -q, 3 * q, 24), ...ring(MZ, 3 * q, -q, 24)], "face");
    svg += poly(ring(MZ, 0, 2 * Math.PI, 48), "face top");
    svg += `<g transform="${TOP(0, 0, MZ)}">
      <clipPath id="rb-cup"><circle cx="${MX}" cy="${MY}" r="${MR - 2.5}"/></clipPath>
      <circle class="face recess" cx="${MX}" cy="${MY}" r="${MR - 2.5}"/>
      <g clip-path="url(#rb-cup)"><circle id="rb-coffee" class="rb-coffee" cx="${MX}" cy="${MY}" r="${MR - 2.5}"/></g></g>
      <g transform="${FRONT(MX + MR - 1.5, MY, MZ - 6)}">
        <path d="M0 2 H4 A9 10 0 0 1 4 22 H0" fill="none" stroke="var(--line)" stroke-width="6.5"/>
        <path d="M0 2 H4 A9 10 0 0 1 4 22 H0" fill="none" stroke="var(--body)" stroke-width="4.5"/></g>`;

    // stage rail with the signal track and labels, then the four keys
    svg += box(RX, RY, 8, RW, RD, RH, 6);
    const kc = KX.map((x) => x + KW / 2 - RX);
    svg += `<g transform="${FRONT(RX, RY + RD, 8 + RH)}">
      <path class="wire-under" d="M10 ${RH} V5 H${kc[3]}"/>
      ${kc
        .map((c, i) => {
          const from = i === 0 ? `M10 ${RH} V5` : `M${kc[i - 1]} 5`;
          return `<path id="rb-s${i}" class="wire" d="${from} H${c}"/>
            <path id="rb-pk${i}" class="pulse" pathLength="1000" d="M10 ${RH} V5 H${c}"/>`;
        })
        .join("")}
      ${kc.map((c, i) => `<circle id="rb-n${i}" class="led" cx="${c}" cy="5" r="2.2"/>`).join("")}
      ${kc
        .map(
          (c, i) =>
            `<text id="rb-l${i}" class="rb-lab" x="${c}" y="18.4" font-size="10.5" text-anchor="middle">${STAGES[i]}</text>`,
        )
        .join("")}</g>`;
    KX.forEach((x, i) => {
      svg += `<g class="press" id="rb-k${i}">${box(x, KY, 8 + RH, KW, KD, 12, 4)}
        <g transform="${TOP(x, KY, 20 + RH)}"><ellipse class="rb-ring" cx="${KW / 2}" cy="${KD / 2}" rx="12" ry="7"/></g></g>`;
    });

    stage.setAttribute("viewBox", K.viewBox);
    stage.innerHTML = svg;
    const $ = (id: string) => stage.querySelector<SVGElement>("#rb-" + id)!;
    const keys = KX.map((_, i) => $("k" + i));
    const labels = KX.map((_, i) => $("l" + i));
    const segs = KX.map((_, i) => $("s" + i));
    const nodes = KX.map((_, i) => $("n" + i));
    const marks = KX.map((_, i) => $("m" + i));
    const scr = $("scr");

    const st = { h: 1, to: 1, ang: 30, busy: false, more: false, typed: 0, pick: 1, seq: 0 };

    function screen() {
      const h = st.h;
      if (h === 1) {
        let s = `<text class="rb-t" x="14" y="18" font-size="7">canvas</text>
          <text class="rb-t" x="146" y="18" font-size="6" text-anchor="end" opacity=".55">3 options</text>`;
        [0, 1, 2].forEach((j) => {
          const x = 15 + j * 46,
            y = 24;
          s += `<rect class="rb-frame${st.pick === j ? " on" : ""}" x="${x}" y="${y}" width="38" height="58" rx="1.5"/>
            <rect class="rb-a" x="${x + 5}" y="${y + 5}" width="28" height="3.4" rx="1"/>`;
          if (j === 0)
            s += `<rect class="rb-a" x="${x + 5}" y="${y + 12}" width="28" height="18" rx="1.5" opacity=".7"/>`;
          if (j === 1)
            s += `<circle class="rb-a" cx="${x + 19}" cy="${y + 21}" r="9" opacity=".7"/>`;
          if (j === 2)
            s += `<rect class="rb-a" x="${x + 5}" y="${y + 12}" width="12.5" height="18" rx="1.5" opacity=".7"/>
              <rect class="rb-a" x="${x + 20.5}" y="${y + 12}" width="12.5" height="18" rx="1.5" opacity=".7"/>`;
          [24, 17, 21].forEach((w, k) => {
            s += `<rect class="rb-a" x="${x + 5}" y="${y + 37 + k * 6}" width="${w}" height="2.6" rx="1" opacity=".45"/>`;
          });
        });
        const cx = 15 + st.pick * 46 + 30,
          cy = 66;
        s += `<path class="rb-hand" transform="translate(${cx} ${cy})" d="M0 0 L0 11 L3 8 L5.4 12.6 L7.2 11.8 L4.9 7.4 L9 7.4 Z"/>`;
        return s;
      }
      if (h === 2) {
        let s = "";
        CODE.forEach(([ind, a, b], i) => {
          const y = 15 + i * 8.2;
          s += `<rect class="rb-a" x="13" y="${y}" width="4" height="3.6" rx="1" opacity=".3"/>`;
          if (i >= st.typed) return;
          const x = 24 + ind * 9;
          s += `<rect class="rb-a" x="${x}" y="${y}" width="${a}" height="3.6" rx="1"/>`;
          if (b)
            s += `<rect class="rb-a" x="${x + a + 3}" y="${y}" width="${b}" height="3.6" rx="1" opacity=".42"/>`;
        });
        const last = CODE[Math.max(0, Math.min(st.typed, CODE.length) - 1)];
        const ly = 15 + (Math.max(1, st.typed) - 1) * 8.2;
        const lx = 24 + last[0] * 9 + last[1] + (last[2] ? last[2] + 3 : 0) + 3;
        s += `<rect class="rb-t blink" x="${lx}" y="${ly - 1}" width="3" height="5.6"/>`;
        return s;
      }
      if (h === 3) {
        let s = "";
        CHECKS.forEach((name, i) => {
          const y = 25 + i * 17,
            done = i < st.typed;
          s += `<rect class="rb-a" x="13" y="${y - 10}" width="134" height="14" rx="2" opacity="${done ? 0.16 : 0.06}"/>
            <text class="rb-t" x="20" y="${y}" font-size="8.5" opacity="${done ? 1 : 0.5}">${name}</text>`;
          s += done
            ? `<circle class="rb-a" cx="136" cy="${y - 3}" r="5.2"/><path class="rb-ok" stroke-width="1.6" d="M133.4 ${y - 3} l1.9 1.9 l3.4 -3.6"/>`
            : `<circle class="rb-ring" cx="136" cy="${y - 3}" r="5.2"/>`;
        });
        return s;
      }
      return `<circle class="rb-a" cx="40" cy="47" r="19"/>
        <path class="rb-ok" stroke-width="3.6" d="M31 47.5 l6.5 6.5 l12 -13"/>
        <text class="rb-a" x="68" y="51" font-size="17" font-weight="700" style="font-family:var(--mono)">shipped</text>
        <text class="rb-t" x="69" y="64" font-size="7" opacity=".6">4 pm · live</text>`;
    }

    function setHands(a: number) {
      $("hh").setAttribute("transform", `translate(42 44) rotate(${a.toFixed(2)})`);
      $("mh").setAttribute("transform", `translate(42 44) rotate(${((a - 30) * 12).toFixed(2)})`);
      const pt = (deg: number) => {
        const r = (deg * Math.PI) / 180;
        return `${(42 + 31 * Math.sin(r)).toFixed(2)} ${(44 - 31 * Math.cos(r)).toFixed(2)}`;
      };
      $("sec").setAttribute(
        "d",
        a - 30 < 0.5 ? "" : `M42 44 L${pt(30)} A31 31 0 ${a - 30 > 180 ? 1 : 0} 1 ${pt(a)} Z`,
      );
    }

    function render() {
      keys.forEach((k, i) => k.classList.toggle("latched", i < st.h));
      labels.forEach((l, i) => l.classList.toggle("on", i < st.h));
      segs.forEach((s, i) => s.classList.toggle("hot", i < st.h));
      nodes.forEach((n, i) => n.classList.toggle("hot", i < st.h));
      marks.forEach((m, i) => m.classList.toggle("hot", i < st.h));
      const sip = [1.5, 4, 6.5, 9][st.h - 1];
      $("coffee").style.transform = `translate(${sip}px, ${sip}px)`;
      $("glass").classList.add("hot");
      $("wire").classList.add("hot");
      scr.innerHTML = screen();
      setHands(st.ang);
      api.power(true);
      api.readout(
        st.busy
          ? `${st.h} pm → ${st.to} pm`
          : `${st.h} pm · ${st.h === 4 ? "shipped" : STAGES[st.h - 1]}`,
      );
    }

    // type the build screen's lines, then tick the checks one by one
    function fill() {
      const seq = ++st.seq;
      const total = st.h === 2 ? CODE.length : st.h === 3 ? CHECKS.length : 0;
      const step = st.h === 2 ? 70 : 260;
      const tick = () => {
        if (seq !== st.seq || st.typed >= total) return;
        st.typed++;
        render();
        api.after(step, tick);
      };
      api.after(step, tick);
    }

    // ease the hands to `to`; a timer finishes the turn if frames are throttled
    let stopTurn: (() => void) | null = null;
    function turn(to: number, ms: number, done: () => void) {
      stopTurn?.();
      const from = st.ang,
        t0 = performance.now();
      let over = false;
      const finish = () => {
        if (over) return;
        over = true;
        stop();
        st.ang = to;
        setHands(to);
        done();
      };
      const stop = api.loop((now) => {
        if (over) return;
        const k = Math.min(1, (now - t0) / ms),
          e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
        st.ang = from + (to - from) * e;
        setHands(st.ang);
        if (k >= 1) finish();
      });
      stopTurn = () => {
        over = true;
        stop();
      };
      api.after(ms + 80, finish);
    }

    const next = () => {
      if (st.busy) st.more = true;
      else go(st.h === 4 ? 1 : st.h + 1);
    };

    function go(h: number) {
      if (st.busy || h === st.h) return;
      const fwd = h > st.h;
      st.busy = true;
      st.to = h;
      st.seq++;
      api.flash($("btn"), 260);
      if (fwd) {
        api.replay($("pw"), "go");
        api.after(430, () => api.replay($("pk" + (h - 1)), "go"));
      }
      render();
      turn(h * 30, fwd ? 1000 : 600, () => {
        const more = st.more;
        Object.assign(st, { h, busy: false, more: false, typed: 0, pick: 1 });
        render();
        fill();
        if (more) api.after(300, next);
      });
    }

    // deciding was slow: the canvas keeps hopping between its options
    api.every(1400, () => {
      if (st.h !== 1 || st.busy) return;
      st.pick = (st.pick + 1) % 3;
      render();
    });

    $("clock").addEventListener("click", next);
    keys.forEach((k, i) => k.addEventListener("click", () => go(i + 1)));
    render();
    return {
      key: (e) => {
        if (e.key === " " || e.key === "Enter") {
          next();
          return true;
        }
        if (e.key === "r" || e.key === "R") {
          go(1);
          return true;
        }
        return false;
      },
      demo: () => [500, 2100, 3700].forEach((t) => api.after(t, next)),
    };
  },
};
