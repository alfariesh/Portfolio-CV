// Rekan: a fertiliser kiosk's counter turned point of sale. The till shows
// today's revenue in big type; each sale draws down a stock bin and sends a
// note to the company's data lake. A bin that runs low lights up and the till
// offers an order from the distributor, which refills it.
import type { IsoFig } from "../types";

const PRODUCTS = ["urea", "npk", "sp-36"] as const;
const PRICE = [180_000, 240_000, 210_000];
const SEQ = [1, 0, 1, 2, 0, 1]; // what the farmers buy, in turn
const LOW = 0.25;
const DRAW = 0.12;

// stock bins along the back
const BX = [70, 134, 198];
const BY = 22,
  BW = 54,
  BD = 42,
  BH = 64,
  BT = 3,
  BZ = 8;
// data lake: three discs
const LX = 394,
  LY = 84,
  LR = 44;
const DISCS = [8, 30, 52];
const DH = 16;

export const rekan: IsoFig = {
  id: "rn",
  name: "Rekan kiosk till",
  hint: "click the till · space sells · o orders · r resets",
  aria: "Isometric fertiliser kiosk counter with a big point-of-sale phone showing today's revenue, a dimmed paper credit ledger, three stock bins with level gauges, a distributor truck and a data lake of stacked discs. Click the till or press space to record a sale: the sale button lights, revenue ticks up, a bin's level drops and a note travels to the data lake, whose counter increments. When a bin runs low its gauge lights and the till offers an order; press o or click the bin to order from the distributor and refill it. Press r to reset.",
  css: `
    [data-fig="rn"] .glass { vector-effect:non-scaling-stroke; }
    [data-fig="rn"] .rn-gauge { fill:var(--line); }
    [data-fig="rn"] .rn-gauge.low { fill:var(--accent); }
    [data-fig="rn"] .rn-grain { fill:var(--detail); }
    [data-fig="rn"] .face.rn-drawn { fill:var(--accent-hi); stroke:var(--accent); }
    [data-fig="rn"] .rn-blabel { fill:var(--ink); }
    [data-fig="rn"] .rn-led { fill:var(--detail); }
    [data-fig="rn"] .rn-led.hot { fill:var(--accent); }
    [data-fig="rn"] .rn-blabel.low { fill:var(--accent); }
    [data-fig="rn"] .rn-ledger { opacity:.55; }
    [data-fig="rn"] .rn-ink { fill:none; stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="rn"] .rn-btn { fill:var(--accent); transition:fill .25s; }
    [data-fig="rn"] .rn-btn.tap { fill:var(--accent-hi); transition:none; }
    [data-fig="rn"] .rn-bin { cursor:pointer; }
    [data-fig="rn"] .rn-num { fill:var(--ink); transition:fill .3s; }
    [data-fig="rn"] .rn-num.hot { fill:var(--accent); }
  `,
  mount(stage, api) {
    const K = api.iso.frame([
      [0, 0, 0],
      [440, 0, 0],
      [0, 260, 0],
      [440, 260, 0],
      [42, 188, 184],
      [124, 188, 184],
      [LX - LR, LY - LR, 70],
      [BX[0], BY, BZ + BH],
    ]);
    const { P, TOP, FRONT, SIDE, box, path } = K;
    const { slits, esc } = api.iso;

    // ground plate, inset line, screws, printed labels
    let svg = box(0, 0, 0, 440, 260, 8, 14);
    svg += `<g transform="${TOP(0, 0, 8)}"><rect class="detail" x="10" y="10" width="420" height="240" rx="8"/>
      ${[
        [18, 18],
        [422, 18],
        [18, 242],
        [422, 242],
      ]
        .map(([x, y]) => `<circle class="detail" cx="${x}" cy="${y}" r="3"/>`)
        .join("")}
      <text class="label" x="262" y="124" font-size="7" opacity=".7">notes</text>
      <text class="label" x="222" y="236" font-size="7" opacity=".7">order</text>
      <text class="label" x="350" y="160" font-size="7" opacity=".7">data lake</text></g>`;

    // wires: till → data lake (every sale), till → distributor (orders)
    const WL = "M200 176 H236 Q246 176 246 166 V140 Q246 130 256 130 H360 Q370 130 370 120 V116";
    const WO = "M200 222 H292";
    svg += `<g transform="${TOP(0, 0, 8)}">
      <path class="wire-under" d="${WL}"/><path id="rn-wl" class="wire" d="${WL}"/>
      <path id="rn-pl" class="pulse" pathLength="1000" d="${WL}"/>
      <path class="wire-under" d="${WO}"/><path id="rn-wo" class="wire" d="${WO}"/>
      <path id="rn-po" class="pulse" pathLength="1000" d="${WO}"/></g>`;

    // stock bins: open tops (the stock level is the floor you see inside),
    // a gauge and a low-stock light on the front
    BX.forEach((x, i) => {
      svg += `<g class="rn-bin" id="rn-bin${i}"><g id="rn-in${i}"></g>
        <g transform="${FRONT(x, BY + BD, BZ + BH)}">
          <rect class="face" width="${BW}" height="${BH}"/>
          <text id="rn-bl${i}" class="rn-blabel" x="7" y="${BH - 9}" font-size="8">${esc(PRODUCTS[i])}</text>
          <rect class="face recess" x="${BW - 15}" y="13" width="9" height="${BH - 23}" rx="1"/>
          <rect id="rn-g${i}" class="rn-gauge" x="${BW - 13.5}" y="13" width="6" height="0"/>
          <circle id="rn-bled${i}" class="rn-led" cx="${BW - 10.5}" cy="6.5" r="2.8"/>
          ${slits(9, 33, 6, 8, 10, false)}</g>
        <g transform="${SIDE(x + BW, BY + BD, BZ + BH)}"><rect class="face" width="${BD}" height="${BH}"/></g>
        <g transform="${TOP(x, BY, BZ + BH)}"><path class="face top" fill-rule="evenodd" d="M0 0H${BW}V${BD}H0Z M${BT} ${BT}V${BD - BT}H${BW - BT}V${BT}Z"/></g></g>`;
    });

    // data lake: three discs on cores, a light on each, the note counter on top
    DISCS.forEach((z, i) => {
      if (i > 0) svg += box(LX - 24, LY - 24, z - 6, 48, 48, 6, 24);
      svg += box(LX - LR, LY - LR, z, LR * 2, LR * 2, DH, LR);
      const arc = Array.from({ length: 13 }, (_, k): [number, number, number] => {
        const a = -Math.PI / 4 + (k / 12) * Math.PI;
        return [LX + LR * Math.cos(a), LY + LR * Math.sin(a), z + DH / 2];
      });
      const [lx, ly] = P(LX + LR * 0.7071, LY + LR * 0.7071, z + DH / 2);
      svg += `<path class="detail" d="${path(arc)}"/><circle id="rn-lled${i}" class="rn-led" cx="${lx}" cy="${ly}" r="2.4"/>`;
    });
    const ZT = DISCS[2] + DH;
    svg += `<g transform="${TOP(0, 0, ZT)}">
      <circle id="rn-ltop" class="glass" cx="${LX}" cy="${LY}" r="${LR - 7}"/>
      <text id="rn-lbig" class="rn-num" x="${LX}" y="${LY + 2}" font-size="14" text-anchor="middle">3.4M</text>
      <text id="rn-lnum" class="label" x="${LX}" y="${LY + 14}" font-size="6.5" text-anchor="middle">—</text></g>`;

    // counter: body, front panel, top slab
    svg += box(24, 150, 8, 176, 90, 54);
    svg += `<g transform="${FRONT(24, 240, 62)}"><rect class="detail" x="10" y="8" width="156" height="30" rx="2"/>${slits(16, 160, 8, 12, 34)}
      <rect class="face" x="0" y="44" width="176" height="10"/></g>`;
    svg += `<g transform="${SIDE(200, 240, 62)}"><rect class="detail" x="10" y="8" width="70" height="30" rx="2"/></g>`;
    svg += box(20, 146, 62, 184, 98, 6, 3);

    // the old way: a paper credit ledger and a pencil, dimmed
    svg += `<g class="rn-ledger" transform="${TOP(144, 168, 68)}">
      <rect class="face top" x="0" y="0" width="27" height="40" rx="1"/>
      <rect class="face top" x="27" y="0" width="27" height="40" rx="1"/>
      <text class="label" x="4" y="9" font-size="6">utang</text>
      ${slits(15, 35, 5, 4, 23, false)}${slits(9, 35, 5, 31, 50, false)}
      <path class="rn-ink" d="M33 14 l6 -3 l5 4 l6 -4"/>
      <rect class="face" x="44" y="22" width="3" height="26" rx="1" transform="rotate(-24 45 35)"/></g>`;

    // the till: a big phone on a stand
    svg += box(36, 180, 68, 94, 24, 4, 4);
    svg += `<g class="press" id="rn-pos">${box(42, 188, 72, 82, 10, 112, 6)}
      <g transform="${FRONT(42, 198, 184)}">
        <clipPath id="rn-clip"><rect x="6" y="10" width="70" height="90" rx="4"/></clipPath>
        <rect class="detail" x="34" y="4" width="14" height="2" rx="1"/>
        <rect id="rn-glass" class="glass" x="6" y="10" width="70" height="90" rx="4"/>
        <g id="rn-scr" clip-path="url(#rn-clip)"></g>
        <rect class="detail" x="32" y="105" width="18" height="2" rx="1"/></g></g>`;

    // distributor truck: chassis, cargo box, cab, wheels
    const TX = 290,
      TY = 200;
    svg += `<g class="press" id="rn-truck">${box(TX + 4, TY + 4, 14, 116, 26, 5)}
      ${box(TX, TY, 18, 84, 34, 40, 2)}
      <g transform="${FRONT(TX, TY + 34, 58)}">${slits(4, 80, 76, 3, 37)}<line class="detail" x1="4" y1="31" x2="80" y2="31"/>
        <rect class="face" x="11" y="9" width="62" height="15" rx="1"/>
        <text class="label" x="42" y="19.5" font-size="7" text-anchor="middle">distributor</text></g>
      ${box(TX + 86, TY + 3, 18, 32, 28, 30, 3)}
      <g transform="${SIDE(TX + 118, TY + 31, 48)}"><rect id="rn-wind" class="glass" x="4" y="3" width="20" height="11" rx="1"/>
        <circle class="rn-led rn-head" cx="5" cy="22" r="2.2"/><circle class="rn-led rn-head" cx="23" cy="22" r="2.2"/></g></g>`;
    [
      [TX + 16, TY + 34],
      [TX + 64, TY + 34],
      [TX + 102, TY + 31],
    ].forEach(([x, y]) => {
      svg += `<g transform="${FRONT(x, y, 24)}"><circle class="face" cx="0" cy="8" r="8"/><circle class="detail" cx="0" cy="8" r="3"/></g>`;
    });

    stage.setAttribute("viewBox", K.viewBox);
    stage.innerHTML = svg;
    const $ = (id: string) => stage.querySelector<SVGElement>("#rn-" + id)!;
    const pos = $("pos"),
      scr = $("scr"),
      truck = $("truck"),
      heads = [...stage.querySelectorAll<SVGElement>(".rn-head")];
    const bins = BX.map((_, i) => $("bin" + i)),
      inner = BX.map((_, i) => $("in" + i)),
      gauges = BX.map((_, i) => $("g" + i)),
      bleds = BX.map((_, i) => $("bled" + i)),
      blabels = BX.map((_, i) => $("bl" + i)),
      lleds = DISCS.map((_, i) => $("lled" + i));

    const START = { sales: 9, rev: 2_140_000, notes: 3_412_880, level: [0.7, 0.42, 0.8] };
    const st = {
      open: false,
      sales: START.sales,
      rev: START.rev,
      notes: START.notes,
      level: START.level.slice(),
      shown: START.level.slice(),
      k: 0,
      busy: false,
      tap: false,
      last: -1,
      sending: false,
      ripple: -1,
      drawn: -1,
      ordering: -1,
      delivering: false,
      run: 0,
    };
    const low = () => st.level.findIndex((l) => l < LOW);

    // the stock you see inside a bin: inner walls down to the level, then the floor
    function binInside(i: number) {
      const x = BX[i],
        lvl = st.shown[i];
      const zl = BZ + 6 + (BH - 12) * lvl,
        top = BZ + BH,
        wall = top - zl,
        w = BW - 2 * BT,
        d = BD - 2 * BT;
      const grains = [
        [8, 8],
        [20, 14],
        [34, 9],
        [12, 24],
        [27, 28],
        [40, 22],
        [6, 32],
        [37, 33],
      ]
        .map(([u, v]) => `<circle class="rn-grain" cx="${u}" cy="${v}" r="1.6"/>`)
        .join("");
      const drawn = st.drawn === i ? " rn-drawn" : "";
      return `<g transform="${FRONT(x + BT, BY + BT, top)}"><rect class="face recess" width="${w}" height="${wall}"/></g>
        <g transform="${SIDE(x + BT, BY + BD - BT, top)}"><rect class="face recess" width="${d}" height="${wall}"/></g>
        <g transform="${TOP(x + BT, BY + BT, zl)}"><rect class="face${drawn}" width="${w}" height="${d}"/>${grains}</g>`;
    }

    const jt = (n: number) => `${(n / 1e6).toFixed(2).replace(".", ",")} jt`;
    const thousands = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    function screen() {
      if (!st.open)
        return `<text class="label" x="41" y="50" font-size="7" text-anchor="middle" opacity=".8">kiosk closed</text>
          <text class="label" x="41" y="61" font-size="6" text-anchor="middle" opacity=".55">tap to open</text>`;
      const l = low();
      let s = `<text class="scr-accent" x="12" y="21" font-size="6" opacity=".7">today · rp</text>
        <text class="scr-accent" x="11" y="38" font-size="14">${esc(jt(st.rev))}</text>
        <text class="scr-accent" x="12" y="48" font-size="6" opacity=".75">${st.sales} sales</text>
        ${st.last >= 0 ? `<text class="scr-accent" x="70" y="48" font-size="6" text-anchor="end">+5 pts</text>` : ""}`;
      if (st.ordering >= 0)
        s += `<rect class="scr-accent" x="9" y="52" width="64" height="11" rx="2" opacity=".18"/>
          <text class="scr-accent" x="41" y="59.6" font-size="5.5" text-anchor="middle">${esc(st.delivering ? `${PRODUCTS[st.ordering]} on its way` : "ordered · paylater")}</text>`;
      else if (l >= 0)
        s += `<rect x="9.5" y="52.5" width="63" height="10" rx="2" fill="none" stroke="var(--accent)" stroke-width=".8"/>
          <text class="scr-accent" x="41" y="59.6" font-size="6" text-anchor="middle">${esc(PRODUCTS[l])} low · order</text>`;
      else if (st.last >= 0)
        s += `<text class="scr-accent" x="12" y="59.6" font-size="6" opacity=".7">${esc(PRODUCTS[st.last])} ×2 · cash</text>`;
      s += `<rect class="rn-btn${st.tap ? " tap" : ""}" x="9" y="66" width="64" height="28" rx="4"/>
        <text x="41" y="84" font-size="11" text-anchor="middle" style="fill:var(--panel);font-family:var(--mono)">${st.tap ? "saved ✓" : "+ sale"}</text>`;
      return s;
    }

    function render() {
      $("glass").classList.toggle("hot", st.open);
      inner.forEach((g, i) => (g.innerHTML = binInside(i)));
      gauges.forEach((g, i) => {
        const h = (BH - 23) * st.shown[i];
        g.setAttribute("y", String(13 + (BH - 23) - h));
        g.setAttribute("height", String(h));
        g.classList.toggle("low", st.level[i] < LOW);
      });
      bleds.forEach((l, i) => l.classList.toggle("hot", st.level[i] < LOW));
      blabels.forEach((l, i) => l.classList.toggle("low", st.level[i] < LOW));
      // the lake is live once notes flow; a landing note runs down its lights
      lleds.forEach((l, i) => l.classList.toggle("hot", st.open && i !== st.ripple));
      $("ltop").classList.toggle("hot", st.open);
      $("lnum").textContent = st.open ? thousands(st.notes) : "—";
      $("lbig").classList.toggle("hot", st.open);
      $("wl").classList.toggle("hot", st.sending);
      $("wo").classList.toggle("hot", st.ordering >= 0 && !st.delivering);
      truck.classList.toggle("latched", st.ordering >= 0);
      $("wind").classList.toggle("hot", st.ordering >= 0);
      heads.forEach((h) => h.classList.toggle("hot", st.ordering >= 0));
      scr.innerHTML = screen();
      api.power(st.open);
      const l = low();
      const stock =
        st.ordering >= 0
          ? `restocking ${PRODUCTS[st.ordering]}`
          : l >= 0
            ? `stock low: ${PRODUCTS[l]}`
            : "stock ok";
      api.readout(
        st.open
          ? `${st.sales} sales today · ${stock} · 3.4M notes/mo`
          : "closed · space to open the till",
      );
    }

    // ease the drawn level toward the stock level
    function settle(i: number) {
      const from = st.shown[i],
        to = st.level[i];
      for (let k = 1; k <= 8; k++)
        api.after(k * 45, () => {
          st.shown[i] = from + ((to - from) * k) / 8;
          render();
        });
    }

    // `tap` is a real press (click or key): the till dips under the finger
    function sale(tap = false) {
      if (tap) api.flash(pos);
      if (!st.open) {
        st.open = true;
        render();
        return;
      }
      if (st.busy) return;
      let p = SEQ[st.k % SEQ.length];
      for (let n = 0; n < 3 && st.level[p] < DRAW / 2; n++) p = (p + 1) % 3;
      if (st.level[p] < DRAW / 2) return; // the shelves are empty
      st.k++;
      Object.assign(st, { busy: true, tap: true, last: p, drawn: p });
      st.sales++;
      st.rev += PRICE[p];
      st.level[p] = Math.max(0, st.level[p] - DRAW);
      settle(p);
      render();
      api.after(260, () => {
        st.tap = false;
        st.drawn = -1;
        st.sending = true;
        api.replay($("pl"), "go");
        render();
      });
      api.after(820, () => {
        Object.assign(st, { sending: false, busy: false });
        st.notes++;
        [0, 1, 2].forEach((i, k) =>
          api.after(k * 90, () => {
            st.ripple = i;
            render();
          }),
        );
        api.after(300, () => {
          st.ripple = -1;
          render();
        });
        render();
      });
    }

    function order(i = low()) {
      if (!st.open || i < 0 || st.level[i] >= LOW || st.ordering >= 0) return;
      st.ordering = i;
      api.replay($("po"), "go");
      render();
      // a reset cancels the delivery still on the road
      const run = st.run;
      const later = (ms: number, fn: () => void) => api.after(ms, () => run === st.run && fn());
      later(700, () => {
        st.delivering = true;
        render();
      });
      // the truck is on the road for a while; sales go on meanwhile
      later(5600, () => {
        st.level[i] = 0.9;
        settle(i);
      });
      later(6200, () => {
        Object.assign(st, { ordering: -1, delivering: false });
        render();
      });
    }

    function reset() {
      st.run++;
      Object.assign(st, {
        sales: START.sales,
        rev: START.rev,
        notes: START.notes,
        level: START.level.slice(),
        shown: START.level.slice(),
        k: 0,
        last: -1,
        ordering: -1,
        delivering: false,
      });
      render();
    }

    pos.addEventListener("click", () => sale(true));
    bins.forEach((b, i) => b.addEventListener("click", () => order(i)));
    truck.addEventListener("click", () => order());
    render();
    return {
      key: (e) => {
        if (e.key === " " || e.key === "Enter") {
          sale(true);
          return true;
        }
        if (e.key === "o" || e.key === "O") {
          order();
          return true;
        }
        if (e.key === "r" || e.key === "R") {
          reset();
          return true;
        }
        return false;
      },
      demo: () => {
        [150, 700, 1600, 2500].forEach((t) => api.after(t, () => sale()));
        api.after(3500, () => order());
        api.after(4900, () => sale());
      },
    };
  },
};
