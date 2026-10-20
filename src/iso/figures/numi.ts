// Numi: a field account executive's day. The phone lands on today's tasks;
// each finished task is a field report that lights its site on the territory
// map, travels to the manager's dashboard and fills that site's coverage
// cell. The kiosk nobody visits stays an empty, flagged cell.
import type { Point3 } from "../kernel";
import type { IsoFig } from "../types";

type Kind = "kiosk" | "dist" | "wh";
type Site = { id: string; name: string; kind: Kind; x: number; y: number };

// The first five sites are today's tasks, in order; kiosk 4 is not on the list.
const SITES: Site[] = [
  { id: "k1", name: "kiosk 1", kind: "kiosk", x: 210, y: 108 },
  { id: "dc", name: "distributor", kind: "dist", x: 334, y: 106 },
  { id: "wh", name: "warehouse", kind: "wh", x: 362, y: 200 },
  { id: "k2", name: "kiosk 2", kind: "kiosk", x: 246, y: 206 },
  { id: "k3", name: "kiosk 3", kind: "kiosk", x: 190, y: 186 },
  { id: "k4", name: "kiosk 4", kind: "kiosk", x: 398, y: 120 },
];
const TASKS = 5;
const SLIP = 5;
const SIZE: Record<Kind, [w: number, d: number, h: number]> = {
  kiosk: [22, 22, 16],
  dist: [38, 26, 18],
  wh: [44, 30, 20],
};
const MZ = 14; // top of the map slab

export const numi: IsoFig = {
  id: "nm",
  name: "Numi field day",
  hint: "click the phone · space next task · r resets the day",
  aria: "Isometric territory map with kiosks, a distributor and a warehouse, a field phone showing today's tasks and a manager's dashboard showing coverage. Click the phone or press space to open today and complete the next task: its site lights on the map, the report travels to the dashboard, the site's coverage cell fills, and the phone's progress bar and target ring advance. The kiosk not on today's list stays flagged as slipping. Press r to reset the day.",
  css: `
    [data-fig="nm"] .glass { vector-effect:non-scaling-stroke; }
    [data-fig="nm"] .nm-cell { fill:var(--recess); stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; transition:fill .3s, stroke .3s; }
    [data-fig="nm"] .nm-cell.on { fill:var(--accent); stroke:var(--accent); }
    [data-fig="nm"] .nm-cell.slip { fill:var(--panel); stroke:var(--accent); stroke-dasharray:3 2; }
    [data-fig="nm"] .nm-ctext { fill:var(--ink); transition:fill .3s; }
    [data-fig="nm"] .nm-ctext.on { fill:var(--panel); }
    [data-fig="nm"] .nm-ctext.slip { fill:var(--accent); }
    [data-fig="nm"] .nm-track { fill:none; stroke:var(--detail); }
    [data-fig="nm"] .nm-arc { fill:none; stroke:var(--accent); stroke-linecap:round; }
    [data-fig="nm"] .nm-route { stroke-dasharray:5 4; stroke-width:1.6; }
    [data-fig="nm"] .nm-alert { fill:none; stroke:var(--accent); stroke-width:1.4; stroke-dasharray:4 3; vector-effect:non-scaling-stroke; }
    [data-fig="nm"] .nm-off { display:none; }
    [data-fig="nm"] .nm-head { fill:var(--deck); stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="nm"] .nm-head.hot { fill:var(--accent); stroke:var(--accent); }
  `,
  mount(stage, api) {
    const K = api.iso.frame([
      [0, 0, 0],
      [440, 0, 0],
      [0, 250, 0],
      [440, 250, 0],
      [110, 34, 158],
      [350, 34, 158],
      [32, 204, 150],
      [106, 214, 150],
    ]);
    const { P, TOP, FRONT, SIDE, box, path } = K;
    const { slits, esc } = api.iso;

    // ground plate, inset line, screws
    let svg = box(0, 0, 0, 440, 250, 8, 14);
    svg += `<g transform="${TOP(0, 0, 8)}"><rect class="detail" x="10" y="10" width="420" height="230" rx="8"/>
      ${[
        [18, 18],
        [422, 18],
        [18, 232],
        [422, 232],
      ]
        .map(([x, y]) => `<circle class="detail" cx="${x}" cy="${y}" r="3"/>`)
        .join("")}
      <text class="label" x="150" y="35" font-size="7" opacity=".7">am → pm</text></g>`;

    // report wire: phone dock → dashboard stand
    const WD = "M76 196 C76 136 112 118 112 80 S120 40 146 40 H200";
    svg += `<g transform="${TOP(0, 0, 8)}"><path class="wire-under" d="${WD}"/><path id="nm-wire" class="wire" d="${WD}"/><circle class="face" cx="200" cy="40" r="2.5"/>
      <path id="nm-pulse" class="pulse" pathLength="1000" d="${WD}"/></g>`;

    // dashboard: stand, neck, wide monitor
    svg += box(200, 22, 8, 60, 34, 5, 4);
    svg += box(222, 30, 13, 16, 8, 30);
    svg += box(110, 34, 40, 240, 12, 118, 4);
    svg += `<g transform="${TOP(110, 34, 158)}">${slits(20, 220, 8, 3, 9)}</g>`;
    svg += `<g transform="${FRONT(110, 46, 158)}">
      <clipPath id="nm-dclip"><rect x="8" y="8" width="224" height="96" rx="3"/></clipPath>
      <rect id="nm-dglass" class="glass" x="8" y="8" width="224" height="96" rx="3"/>
      <g id="nm-dash" clip-path="url(#nm-dclip)"></g>
      <circle id="nm-dled" class="led" cx="120" cy="111" r="2"/></g>`;
    svg += `<g transform="${SIDE(350, 46, 158)}">${slits(14, 104, 10, 3, 9, false)}</g>`;

    // field phone in its dock
    svg += box(24, 196, 8, 90, 30, 6, 6);
    svg += `<g class="press" id="nm-phone">${box(32, 204, 14, 74, 10, 136, 5)}
      <g transform="${FRONT(32, 214, 150)}">
        <clipPath id="nm-pclip"><rect x="6" y="12" width="62" height="112" rx="4"/></clipPath>
        <rect class="detail" x="30" y="5" width="14" height="2" rx="1"/>
        <rect id="nm-pglass" class="glass" x="6" y="12" width="62" height="112" rx="4"/>
        <g id="nm-scr" clip-path="url(#nm-pclip)"></g>
        <rect class="detail" x="28" y="129" width="18" height="2" rx="1"/></g></g>`;

    // territory map: slab, roads, boundary, route, the slipping kiosk's ring
    svg += box(150, 64, 8, 280, 176, MZ - 8, 6);
    svg += `<g transform="${TOP(0, 0, MZ)}">
      <rect class="detail" x="160" y="74" width="260" height="156" rx="6" stroke-dasharray="4 3"/>
      <path class="detail" d="M160 150 H280 M290 150 H420 M160 160 H280 M290 160 H420 M280 74 V150 M280 160 V230 M290 74 V150 M290 160 V230"/>
      <text class="label" x="166" y="224" font-size="7" opacity=".7">territory 04</text>
      <path id="nm-route" class="wire hot nm-route" d=""/>
      <circle id="nm-alert" class="nm-alert blink" cx="${SITES[SLIP].x}" cy="${SITES[SLIP].y}" r="23"/></g>`;

    const site = (s: Site) => {
      const [w, d, h] = SIZE[s.kind];
      const x = s.x - w / 2,
        y = s.y - d / 2,
        z = MZ;
      let g = box(x, y, z, w, d, h);
      if (s.kind === "kiosk") {
        g += `<g transform="${FRONT(x, y + d, z + h)}"><rect class="detail" x="4" y="5" width="${w - 8}" height="6"/></g>`;
        g += box(x - 2, y - 2, z + h, w + 4, d + 4, 3);
      } else if (s.kind === "dist") {
        g += `<g transform="${FRONT(x, y + d, z + h)}"><rect class="face recess" x="5" y="6" width="14" height="${h - 6}"/>${slits(9, 15, 3, 6, 18, false)}
          <rect class="detail" x="24" y="5" width="9" height="5"/></g>`;
        g += `<g transform="${SIDE(x + w, y + d, z + h)}"><rect class="detail" x="6" y="5" width="${d - 12}" height="5"/></g>`;
      } else {
        const Z = z + h,
          r = 9,
          m = y + d / 2;
        const back: Point3[] = [
          [x, y, Z],
          [x + w, y, Z],
          [x + w, m, Z + r],
          [x, m, Z + r],
        ];
        const front: Point3[] = [
          [x, m, Z + r],
          [x + w, m, Z + r],
          [x + w, y + d, Z],
          [x, y + d, Z],
        ];
        const gable: Point3[] = [
          [x + w, y, Z],
          [x + w, y + d, Z],
          [x + w, m, Z + r],
        ];
        g += `<g transform="${FRONT(x, y + d, z + h)}"><rect class="face recess" x="15" y="6" width="14" height="${h - 6}"/></g>`;
        g += `<path class="face top" d="${path(back)}Z"/><path class="face top" d="${path(front)}Z"/><path class="face" d="${path(gable)}Z"/>`;
        g += `<path class="detail" d="${path([
          [x + 3, m + 5, Z + r - 5 * (r / (d / 2))],
          [x + w - 3, m + 5, Z + r - 5 * (r / (d / 2))],
        ])}"/>`;
      }
      return g;
    };
    SITES.map((s, i) => ({ s, i }))
      .sort((a, b) => a.s.x + a.s.y - (b.s.x + b.s.y))
      .forEach(({ s, i }) => {
        svg += `<g class="press" id="nm-site${i}">${site(s)}</g>`;
      });

    stage.setAttribute("viewBox", K.viewBox);
    // the next stop: a pin over its site
    svg += `<g id="nm-pin"></g>`;
    stage.innerHTML = svg;
    const $ = (id: string) => stage.querySelector<SVGElement>("#nm-" + id)!;
    const phone = $("phone"),
      scr = $("scr"),
      dash = $("dash"),
      route = $("route"),
      alert = $("alert"),
      pulse = $("pulse"),
      pin = $("pin");
    const sites = SITES.map((_, i) => $("site" + i));

    const st = { open: false, done: 0, busy: false, at: -1, sending: false };
    const target = () => 56 + st.done * 4;
    const visited = (i: number) => i < st.done || (st.busy && i === st.at);

    function phoneScreen() {
      if (!st.open)
        return `<text class="label" x="37" y="62" font-size="6.5" text-anchor="middle" opacity=".8">good morning</text>
          <text class="label" x="37" y="72" font-size="6" text-anchor="middle" opacity=".55">tap for today</text>`;
      const t = target();
      let s = `<circle class="nm-track" cx="19" cy="28" r="7.5" stroke-width="2.6"/>
        <circle class="nm-arc" cx="19" cy="28" r="7.5" stroke-width="2.6" pathLength="100" stroke-dasharray="${t} 100" transform="rotate(-90 19 28)"/>
        <text class="scr-accent" x="32" y="25" font-size="6" opacity=".7">target</text>
        <text class="scr-accent" x="32" y="34.5" font-size="9">${t}%</text>
        <text class="scr-accent" x="11" y="49" font-size="6" opacity=".7">today</text>
        <text class="scr-accent" x="63" y="49" font-size="6" text-anchor="end">${st.done}/${TASKS}</text>
        <rect class="scr-accent" x="11" y="52" width="52" height="4" rx="1" opacity=".22"/>
        <rect class="scr-accent" x="11" y="52" width="${(52 * st.done) / TASKS}" height="4" rx="1"/>`;
      for (let i = 0; i < TASKS; i++) {
        const y = 67 + i * 10,
          done = i < st.done,
          cur = i === st.done && st.done < TASKS;
        if (cur)
          s += `<rect class="scr-accent" x="8" y="${y - 6.5}" width="58" height="9" rx="1.5" opacity=".2"/>`;
        s += `<circle class="scr-accent" cx="12.5" cy="${y - 2}" r="2" opacity="${done || cur ? 1 : 0.3}"/>
          <text class="scr-accent" x="17.5" y="${y}" font-size="6" opacity="${done || cur ? 1 : 0.45}">${esc(SITES[i].name)}</text>
          ${done ? `<text class="scr-accent" x="65" y="${y}" font-size="6" text-anchor="end">✓</text>` : ""}`;
      }
      const btn = st.busy ? "sending…" : st.done < TASKS ? "start next" : "day done";
      s += `<rect class="scr-accent" x="11" y="112" width="52" height="9" rx="2" opacity="${st.busy || st.done === TASKS ? 0.45 : 1}"/>
        <text x="37" y="118.6" font-size="5.5" text-anchor="middle" style="fill:var(--panel);font-family:var(--mono)">${esc(btn)}</text>`;
      return s;
    }

    function dashScreen() {
      const t = target();
      // closed: the dashboard waits for the day's first report
      const c = st.open ? "scr-accent" : "label";
      let s = `<text class="${c}" x="20" y="26" font-size="8" opacity=".7">target · oct</text>
        <text class="${c}" x="18" y="58" font-size="28" opacity="${st.open ? 1 : 0.4}">${st.open ? `${t}%` : "—"}</text>
        <rect class="${c}" x="20" y="66" width="84" height="6" rx="1" opacity=".22"/>
        <rect class="scr-accent" x="20" y="66" width="${st.open ? (84 * t) / 100 : 0}" height="6" rx="1"/>
        <line class="detail" x1="${20 + 84 * 0.8}" y1="63" x2="${20 + 84 * 0.8}" y2="75"/>
        <text class="${c}" x="20" y="88" font-size="8" opacity=".7">tasks ${st.done}/${TASKS}</text>
        <text class="${c}" x="20" y="98" font-size="8">${st.open ? "1 kiosk slipping" : ""}</text>
        <line class="detail" x1="116" y1="18" x2="116" y2="94"/>
        <text class="${c}" x="128" y="26" font-size="8" opacity=".7">coverage</text>`;
      SITES.forEach((site, i) => {
        const cx = 128 + (i % 3) * 33,
          cy = 34 + Math.floor(i / 3) * 31;
        const cls = i < st.done ? "on" : st.open && i === SLIP ? "slip" : "";
        s += `<rect class="nm-cell ${cls}${cls === "slip" ? " blink" : ""}" x="${cx}" y="${cy}" width="28" height="26" rx="2"/>
          <text class="nm-ctext ${cls}" x="${cx + 14}" y="${cy + 16}" font-size="8.5" text-anchor="middle">${esc(cls === "slip" ? `${site.id}!` : site.id)}</text>`;
      });
      return s;
    }

    function render() {
      ["pglass", "dglass"].forEach((id) => $(id).classList.toggle("hot", st.open));
      $("dled").classList.toggle("hot", st.open);
      $("wire").classList.toggle("hot", st.sending);
      sites.forEach((el, i) => el.classList.toggle("latched", st.open && visited(i)));
      const n = st.busy ? st.at : st.done;
      if (st.open && n < TASKS) {
        const s = SITES[n],
          top = MZ + SIZE[s.kind][2] + (s.kind === "wh" ? 9 : 3);
        const [x0, y0] = P(s.x, s.y, top + 4),
          [x1, y1] = P(s.x, s.y, top + 24);
        pin.innerHTML = `<line class="wire${st.busy ? " hot" : ""}" x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}"/>
          <circle class="nm-head${st.busy ? " hot" : ""}" cx="${x1}" cy="${y1}" r="3.5"/>`;
      } else pin.innerHTML = "";
      const pts = SITES.slice(0, st.done + (st.busy ? 1 : 0)).map((s) => `${s.x} ${s.y}`);
      route.setAttribute("d", pts.length > 1 ? `M${pts.join("L")}` : "");
      alert.classList.toggle("nm-off", !st.open);
      scr.innerHTML = phoneScreen();
      dash.innerHTML = dashScreen();
      api.power(st.open);
      const t = target();
      api.readout(
        !st.open
          ? "closed · space to open today"
          : st.busy
            ? `logging ${SITES[st.at].name}… · ${st.done}/${TASKS} tasks`
            : `${st.done < TASKS ? `${st.done}/${TASKS} tasks` : "day done"} · target ${t}% · 1 kiosk slipping`,
      );
    }

    // `tap` is a real press (click or key): the phone flashes under the finger
    function next(tap = false) {
      if (st.busy) return;
      if (tap) api.flash(phone);
      if (!st.open) {
        st.open = true;
        render();
        return;
      }
      if (st.done >= TASKS) return;
      Object.assign(st, { busy: true, at: st.done });
      api.flash(sites[st.at], 260);
      render();
      api.after(420, () => {
        st.sending = true;
        api.replay(pulse, "go");
        render();
        api.after(560, () => {
          Object.assign(st, { done: st.done + 1, busy: false, sending: false });
          render();
        });
      });
    }

    function reset() {
      if (st.busy) return;
      Object.assign(st, { done: 0, at: -1 });
      render();
    }

    phone.addEventListener("click", () => next(true));
    sites.forEach((el, i) =>
      el.addEventListener("click", () => {
        if (!st.open || i === st.done) next(true);
      }),
    );
    render();
    return {
      key: (e) => {
        if (e.key === " " || e.key === "Enter") {
          next(true);
          return true;
        }
        if (e.key === "r" || e.key === "R") {
          reset();
          return true;
        }
        return false;
      },
      demo: () => [200, 900, 2000, 3100, 4200].forEach((t) => api.after(t, () => next())),
    };
  },
};
