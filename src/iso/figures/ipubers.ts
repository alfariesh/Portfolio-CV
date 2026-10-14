// iPubers: a village kiosk redeeming subsidised fertiliser in five steps
// (farmer id, stock, quota, id card photo, redeem). Ported from
// iso-glow/ipubers.html.
import type { IsoFig } from "../types";

export const ipubers: IsoFig = {
  id: "ip",
  name: "iPubers redemption",
  hint: "Click the phone · space next step · r restock",
  aria: "Isometric village kiosk redeeming subsidised fertiliser. Click the phone or press space to walk one redemption: farmer id, stock, quota, id card photo, redeem. Press r to restock the sacks.",
  css: `
    [data-fig="ip"] .glass { vector-effect:non-scaling-stroke; }
    [data-fig="ip"] .ip-cell { fill:var(--recess); stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; transition:fill .3s, stroke .3s; }
    [data-fig="ip"] .ip-cell.on { fill:var(--accent); stroke:var(--accent-hi); }
    [data-fig="ip"] .ip-sign { transition:fill .3s; }
    [data-fig="ip"] .ip-sign.on { fill:var(--accent-hi); }
    [data-fig="ip"] .ip-card { stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
    [data-fig="ip"] .ip-card.hot { stroke:var(--accent); }
    [data-fig="ip"] .ip-scan { stroke:var(--accent-hi); stroke-width:1.6; vector-effect:non-scaling-stroke; opacity:0; }
    [data-fig="ip"] .ip-gone { display:none; }
  `,
  mount(stage, api) {
    const K = api.iso.frame([
      [0, 0, 0],
      [420, 0, 0],
      [0, 250, 0],
      [420, 250, 0],
      [260, 120, 138],
      [330, 130, 138],
      [150, 30, 160],
      [12, 12, 112],
      [390, 20, 92],
    ]);
    const { P, TOP, FRONT, SIDE, box } = K;
    const { slits, esc } = api.iso;

    // ground plate + printed link label
    let svg = box(0, 0, 0, 420, 250, 8, 14);
    svg += `<g transform="${TOP(0, 0, 8)}"><rect class="detail" x="10" y="10" width="400" height="230" rx="8"/>
      ${[
        [18, 18],
        [402, 18],
        [18, 232],
        [402, 232],
      ]
        .map(([x, y]) => `<circle class="detail" cx="${x}" cy="${y}" r="3"/>`)
        .join("")}
      <text class="label" x="352" y="112" font-size="7" opacity=".7">120 ms</text></g>`;

    // data wire: phone → e-alokasi node, with light pulses both ways
    const WD = "M326 127 H337 Q345 127 345 119 V80";
    const WR = "M345 80 V119 Q345 127 337 127 H326";
    svg += `<g transform="${TOP(0, 0, 8)}"><path class="wire-under" d="${WD}"/><path id="ip-wire" class="wire" d="${WD}"/>
      <path id="ip-pout" class="pulse" pathLength="1000" d="${WD}"/><path id="ip-pin" class="pulse" pathLength="1000" d="${WR}"/></g>`;

    // kiosk: walls, front window with shelves, side door and sign
    svg += box(20, 20, 8, 160, 120, 96, 4);
    svg += `<g transform="${FRONT(20, 140, 104)}">
      <rect class="face" x="0" y="4" width="160" height="12"/>${slits(8, 152, 8, 4, 16)}
      <rect id="ip-win" class="glass" filter="url(#soft)" x="18" y="26" width="124" height="40" rx="2"/>
      ${slits(40, 53, 13, 22, 138, false)}
      ${[26, 40, 54, 92, 106].map((u) => `<rect class="detail" x="${u}" y="31" width="10" height="9" rx="2"/>`).join("")}
      ${[34, 48, 62, 76, 100, 114, 128].map((u) => `<rect class="detail" x="${u}" y="44" width="10" height="9" rx="2"/>`).join("")}
      <rect class="face" x="12" y="66" width="136" height="7"/>${slits(78, 92, 5, 12, 148, false)}</g>`;
    svg += `<g transform="${SIDE(180, 140, 104)}">
      <rect class="face recess" x="12" y="36" width="28" height="60"/>
      <rect id="ip-door" class="glass" x="17" y="44" width="18" height="18" rx="1"/>
      <rect class="face" x="48" y="18" width="46" height="22" rx="2"/>
      <text id="ip-sign" class="label ip-sign" x="71" y="32.5" font-size="8" text-anchor="middle">kios tani</text>
      <rect id="ip-swin" class="glass" filter="url(#soft)" x="52" y="52" width="38" height="24" rx="1"/>
      <line class="detail" x1="71" y1="52" x2="71" y2="76"/></g>`;
    svg += box(12, 12, 104, 176, 136, 8, 4);
    // signal mast on the roof
    svg += box(150, 30, 112, 6, 6, 40, 0);
    const [mx, my] = P(153, 33, 156);
    svg += `<circle class="halo" id="ip-mhalo" filter="url(#bloom)" cx="${mx}" cy="${my}" r="14"/>
      <circle class="led" id="ip-mast" filter="url(#soft)" cx="${mx}" cy="${my}" r="3"/>
      ${[8, 14].map((r, i) => `<path id="ip-arc${i}" class="wire" d="M${mx + r * 0.6} ${my - r * 0.8} A${r} ${r} 0 0 1 ${mx + r * 0.6} ${my + r * 0.8} M${mx - r * 0.6} ${my - r * 0.8} A${r} ${r} 0 0 0 ${mx - r * 0.6} ${my + r * 0.8}"/>`).join("")}`;

    // fertiliser sacks: two columns of three; removal order front-top first
    const SACKS: [number, number][] = [];
    [34, 72].forEach((x) => [8, 22, 36].forEach((z) => SACKS.push([x, z])));
    SACKS.forEach(([x, z], i) => {
      svg += `<g class="press" id="ip-sack${i}">${box(x, 166, z, 34, 48, 14, 6)}
        <g transform="${FRONT(x, 214, z + 14)}"><text class="label" x="17" y="10" font-size="6" text-anchor="middle">npk</text></g>
        <g transform="${SIDE(x + 34, 214, z + 14)}"><line class="detail" x1="5" y1="4" x2="43" y2="4" stroke-dasharray="2 2"/></g></g>`;
    });
    const ORDER = [5, 2, 4, 1, 3, 0];

    // e-alokasi node: quota meter on the front, rack units on the side
    svg += box(300, 20, 8, 90, 60, 84, 4);
    svg += `<g transform="${TOP(300, 20, 92)}">${slits(14, 76, 6, 12, 48)}</g>`;
    svg += `<g transform="${FRONT(300, 80, 92)}">
      <text class="label" x="10" y="15" font-size="7">e-alokasi</text>
      <g filter="url(#soft)">${Array.from({ length: 8 }, (_, i) => `<rect id="ip-cell${i}" class="ip-cell" x="${10 + i * 9.25}" y="22" width="6.5" height="36" rx="1"/>`).join("")}</g>
      <text id="ip-qtext" class="label" x="10" y="72" font-size="7">quota —/8</text></g>`;
    svg += `<g transform="${SIDE(390, 80, 92)}">${[0, 1, 2, 3, 4]
      .map((i) => {
        const v = 8 + i * 15;
        return `<rect class="face recess" x="6" y="${v}" width="48" height="11" rx="1"/>${slits(10, 34, 3, v + 2, v + 9)}
        <circle id="ip-rled${i}" class="led" filter="url(#soft)" cx="46" cy="${v + 5.5}" r="2"/>`;
      })
      .join("")}</g>`;

    // the kiosk's phone: the redemption screen
    svg += `<g transform="${FRONT(260, 130, 138)}"><rect id="ip-phalo" class="halo" filter="url(#bloom)" x="-14" y="-8" width="98" height="144" rx="22"/></g>`;
    svg += `<g class="press" id="ip-phone">${box(260, 120, 8, 70, 10, 130, 4)}
      <g transform="${FRONT(260, 130, 138)}">
        <clipPath id="ip-clip"><rect x="6" y="10" width="58" height="104" rx="4"/></clipPath>
        <rect class="detail" x="28" y="4" width="14" height="2" rx="1"/>
        <rect id="ip-glass" class="glass" filter="url(#soft)" x="6" y="10" width="58" height="104" rx="4"/>
        <g id="ip-scr" clip-path="url(#ip-clip)"></g>
        <rect class="detail" x="26" y="120" width="18" height="2" rx="1"/></g></g>`;

    // the farmer's KTP card on the plate
    svg += `<g id="ip-ktp" transform="${TOP(290, 180, 8)}" style="cursor:pointer">
      <rect id="ip-khalo" class="halo" filter="url(#bloom)" x="-8" y="-8" width="66" height="48" rx="8"/>
      <rect id="ip-card" class="glass ip-card" filter="url(#soft)" x="0" y="0" width="50" height="32" rx="3"/>
      <rect class="detail" x="36" y="6" width="10" height="13" rx="1"/>${slits(8, 23, 5, 4, 30, false)}
      <text class="label" x="36" y="28" font-size="5">ktp</text>
      <line id="ip-scan" class="ip-scan" x1="1" x2="49" y1="2" y2="2"/></g>`;

    stage.setAttribute("viewBox", K.viewBox);
    stage.innerHTML = svg;
    const $ = (id: string) => stage.querySelector<SVGElement>("#ip-" + id)!;
    const sacks = SACKS.map((_, i) => $("sack" + i)),
      cells = [...Array(8)].map((_, i) => $("cell" + i));
    const rleds = [...Array(5)].map((_, i) => $("rled" + i)),
      scr = $("scr");

    const FARMERS: [nik: string, used: number][] = [
      ["3201··0042", 3],
      ["3204··1187", 5],
      ["3206··0519", 1],
      ["3210··7731", 6],
    ];
    const STEPS = ["nik", "stock", "quota", "ktp photo", "redeem"];
    const NEXT = ["", "check stock", "check quota", "take ktp", "redeem", "next farmer"];
    const st = {
      open: false,
      step: 0,
      f: 0,
      typed: 0,
      stock: 6,
      n: 0,
      busy: false,
      fail: "",
      used: FARMERS.map((f) => f[1]),
      rack: -1,
      scan: false,
      sending: false,
    };
    const rem = () => 8 - st.used[st.f];
    const nik = () => FARMERS[st.f][0];

    function screen() {
      if (!st.open)
        return `<text class="label" x="35" y="58" font-size="6" text-anchor="middle" opacity=".6">tap to open</text>`;
      let cap = "",
        val = "";
      if (st.fail) {
        cap = "stopped";
        val = st.fail;
      } else if (st.step === 1) {
        cap = "farmer nik";
        val = nik().slice(0, st.typed) + (st.typed < nik().length ? "_" : "");
      } else if (st.step === 2) {
        cap = "stock at kiosk";
        val = `${st.stock} sacks`;
      } else if (st.step === 3) {
        cap = "quota left";
        val = st.busy ? "checking…" : `${rem()} of 8`;
      } else if (st.step === 4) {
        cap = "ktp photo";
        val = st.busy ? "scanning…" : "ocr ✓ gps ✓";
      } else if (st.step === 5) {
        cap = "redeemed in";
        val = st.busy ? "sending…" : "120 ms";
      }
      let s = `<text class="scr" x="11" y="22" font-size="5" opacity=".75">${esc(cap)}</text>
        <text class="scr" x="11" y="33" font-size="7.5">${esc(val)}</text>
        <line class="detail" x1="10" y1="39" x2="60" y2="39"/>`;
      STEPS.forEach((name, i) => {
        const y = 49 + i * 10,
          done = st.step > i + 1 || (st.step === i + 1 && !st.busy && !st.fail),
          cur = st.step === i + 1 && (st.busy || st.fail);
        const nextUp = !st.busy && !st.fail && st.step === i && st.step < 5;
        if (cur || nextUp)
          s += `<rect class="scr-accent" x="8" y="${y - 6.5}" width="54" height="9" rx="1.5" opacity=".22"/>`;
        s += `<circle class="${done || cur ? "scr-accent" : "scr"}" cx="13" cy="${y - 2}" r="2" opacity="${done || cur || nextUp ? 1 : 0.35}"/>
          <text class="scr" x="19" y="${y}" font-size="5.5" opacity="${done || cur || nextUp ? 1 : 0.4}">${name}</text>
          ${done ? `<text class="scr" x="59" y="${y}" font-size="5.5" text-anchor="end">✓</text>` : cur && st.busy ? `<text class="scr" x="59" y="${y}" font-size="5.5" text-anchor="end">…</text>` : ""}`;
      });
      const btn = st.fail ? (st.stock === 0 ? "restock · r" : "next farmer") : NEXT[st.step];
      s += `<rect class="scr-accent" x="11" y="101" width="48" height="10" rx="2" opacity="${st.busy ? 0.4 : 1}"/>
        <text x="35" y="108" font-size="5.5" text-anchor="middle" style="fill:var(--panel);font-family:var(--mono)">${esc(btn)}</text>`;
      return s;
    }

    function render() {
      const removed = 6 - st.stock,
        gone = ORDER.slice(0, removed),
        pick = ORDER[removed];
      sacks.forEach((el, i) => {
        el.classList.toggle("ip-gone", gone.includes(i));
        el.classList.toggle("latched", i === pick && st.step >= 2 && st.step < 5 && !st.fail);
      });
      ["win", "swin", "door", "glass"].forEach((id) => $(id).classList.toggle("hot", st.open));
      $("sign").classList.toggle("on", st.open);
      const shown = st.step >= 3 && !(st.step === 3 && st.busy);
      cells.forEach((c, i) => c.classList.toggle("on", shown && i < rem()));
      $("qtext").textContent = shown ? `quota ${rem()}/8` : "quota —/8";
      rleds.forEach((l, i) => l.classList.toggle("hot", i === 0 || i === st.rack));
      $("card").classList.toggle("hot", st.step >= 4 && !st.fail);
      $("khalo").classList.toggle("hot", st.scan);
      $("phalo").classList.toggle("hot", st.open);
      $("wire").classList.toggle("hot", st.sending);
      [$("mast"), $("mhalo"), $("arc0"), $("arc1")].forEach((el) =>
        el.classList.toggle("hot", st.sending),
      );
      scr.innerHTML = screen();
      api.power(st.open);
      const where = !st.open
        ? "closed · space to open"
        : st.fail
          ? st.fail
          : `${st.step === 5 ? "redeemed" : STEPS[st.step - 1]}${st.busy ? "…" : ""}`;
      api.readout(st.open ? `${where} · stock ${st.stock} · ${st.n} redeemed` : where);
    }

    // a packet to e-alokasi; `back` returns a reply pulse after it lands
    function send(back: boolean, done: () => void) {
      st.sending = true;
      api.replay($("pout"), "go");
      render();
      api.after(550, () => {
        [1, 2, 3, 4].forEach((i, k) =>
          api.after(k * 70, () => {
            st.rack = i;
            render();
          }),
        );
        api.after(300, () => {
          st.rack = -1;
          if (back) api.replay($("pin"), "go");
        });
        api.after(back ? 850 : 350, () => {
          st.sending = false;
          done();
        });
      });
    }

    function next() {
      if (st.busy) return;
      if (!st.open || st.step === 5 || st.fail) {
        if (st.fail && st.stock === 0) return; // needs a restock first
        if (st.open) st.f = (st.f + 1) % FARMERS.length;
        Object.assign(st, { open: true, step: 1, typed: 0, fail: "", busy: true });
        const type = () => {
          st.typed++;
          render();
          if (st.typed < nik().length) api.after(55, type);
          else {
            st.busy = false;
            render();
          }
        };
        api.after(120, type);
        render();
        return;
      }
      if (st.step === 1) {
        if (st.stock === 0) {
          st.fail = "out of stock";
          render();
          return;
        }
        Object.assign(st, { step: 2, busy: true });
        const live = ORDER.slice(6 - st.stock).reverse();
        live.forEach((i, k) => api.after(k * 80, () => api.flash(sacks[i])));
        api.after(live.length * 80 + 260, () => {
          st.busy = false;
          render();
        });
      } else if (st.step === 2) {
        Object.assign(st, { step: 3, busy: true });
        send(true, () => {
          st.busy = false;
          if (rem() === 0) st.fail = "quota used up";
          render();
        });
      } else if (st.step === 3) {
        Object.assign(st, { step: 4, busy: true, scan: true });
        const line = $("scan"),
          t0 = performance.now();
        line.style.opacity = "1";
        const stop = api.loop((t) => {
          const k = Math.min(1, (t - t0) / 900),
            y = 2 + 28 * (0.5 - 0.5 * Math.cos(k * Math.PI * 2));
          line.setAttribute("y1", String(y));
          line.setAttribute("y2", String(y));
          if (k >= 1) {
            line.style.opacity = "0";
            st.scan = false;
            st.busy = false;
            render();
            stop();
          }
        });
      } else if (st.step === 4) {
        Object.assign(st, { step: 5, busy: true });
        st.stock--;
        st.used[st.f]++;
        st.n++;
        send(false, () => {
          st.busy = false;
          render();
        });
      }
      render();
    }

    function restock() {
      st.stock = 6;
      st.used = FARMERS.map((f) => f[1]);
      if (st.fail === "out of stock") st.fail = "";
      render();
    }

    $("phone").addEventListener("click", next);
    sacks.forEach((s) =>
      s.addEventListener("click", () => {
        if (st.step === 1) next();
      }),
    );
    $("ktp").addEventListener("click", () => {
      if (st.step === 3) next();
    });
    render();
    return {
      key: (e) => {
        if (e.key === " " || e.key === "Enter") {
          next();
          return true;
        }
        if (e.key === "r" || e.key === "R") {
          restock();
          return true;
        }
        return false;
      },
      demo: () => [200, 1150, 2100, 3700, 4800].forEach((t) => api.after(t, next)),
    };
  },
};
