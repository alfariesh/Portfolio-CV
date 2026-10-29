import { useEffect, useRef } from "react";

// A headline line you can edit like a canvas, adapted from React Bits'
// TechText (MIT), working on words rather than letters. The words stay real
// DOM text (prerendered, wrapping, kerned by the browser); a canvas laid over
// the line draws what a design tool would: a dashed outline of the active
// word, a selection frame with handles, blinking specks and a mono label. On
// load an "agent" frame runs along the line, turning each word into its
// outline and filling it back in, and the line hops once at the end. Words
// can be dragged off the baseline (they spring home) and clicked to send a
// ripple through their neighbours.
//
// The intro is a multiplayer canvas: the first agent's cursor drives the
// frame and types a prompt for each word in the label, the other agents and
// the author follow a few words behind, and the author clicks the last word
// to ship the line. Then every cursor parks on its own word and stays there,
// riding along when that word is dragged or hops.

type Box = { x1: number; y1: number; x2: number; y2: number };
type Art = { image: HTMLCanvasElement; left: number; top: number };
type Glyph = {
  el: HTMLSpanElement;
  word: string;
  x: number;
  baseline: number;
  box: Box;
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
  outline: number;
  dashes: Art | null;
  styled: string;
};
type Kick = { index: number; at: number; velocity: number };

// Room around the line for labels, specks and dragged words.
const PAD = 48;
const SPRING = 320;
const BOUNCE = 0.4;
const KICK_DECAY = 0.62;
const SPECKS = 12;
const LABEL_FONT = '11px "JetBrains Mono Variable", ui-monospace, monospace';
const LABEL_TRACKING = "1.2px";
const INTRO_DELAY = 0.6;
// Seconds per word, quicker on longer lines so the pass stays about 4.5s.
const introStep = (words: number) => Math.min(0.5, 4.5 / Math.max(1, words));
const INTRO_TRAIL = 2;
// Characters per second the agent types its prompts at.
const TYPE_RATE = 45;
// After the pass: the author's cursor reaches the last word and clicks it,
// then everyone heads for their parking spot.
const FINALE_CLICK = 0.6;
const FINALE_END = 1;

const approach = (current: number, target: number, dt: number, seconds: number) =>
  current + (target - current) * (1 - Math.exp(-dt / seconds));

const noise = (...values: number[]) => {
  let h = 2166136261;
  for (const value of values) {
    h = Math.imul(h ^ (value | 0), 16777619);
    h ^= h >>> 13;
    h = Math.imul(h, 0x5bd1e995);
    h ^= h >>> 15;
  }
  return (h >>> 0) / 4294967296;
};

const signed = (value: number) => (value > 0 ? `+${value}` : value < 0 ? `−${-value}` : "0");

// A cursor on the canvas: its name tag, a colour token (a CSS custom
// property on the line, like "--accent") and the word it parks on.
export type Collaborator = { name: string; color: string; park: string };
type Cursor = Collaborator & { fill: string; x: number; y: number; alpha: number; press: number };

type LiveTypeProps = {
  text: string;
  // One prompt per word, typed by the first agent as it reaches that word.
  prompts?: string[];
  author?: Collaborator;
  agents?: Collaborator[];
  className?: string;
};

const nobody: Collaborator = { name: "you", color: "--ink-soft", park: "" };

export function LiveType({
  text,
  prompts = [],
  author = nobody,
  agents = [],
  className = "",
}: LiveTypeProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const words = text.split(" ");
  const promptKey = prompts.join("\n");
  const castKey = JSON.stringify([author, ...agents]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return undefined;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let glyphs: Glyph[] = [];
    let width = 1;
    let height = 1;
    let dpr = 1;
    let font = "";
    let tracking = "0px";
    let ink = "";
    let accent = "";
    let paper = "";
    const lines = promptKey ? promptKey.split("\n") : [];
    let raf = 0;
    let last = performance.now();
    let pulse = 0;
    let visible = false;
    let ready = false;
    let alive = true;
    let dragging = -1;
    let cursor = "";
    // The intro runs once, the first time the line is in view with its font.
    let intro = reducedMotion ? -1 : 0;
    let launched = false;
    let finale = -1;
    // The author first, then the agents; the first agent leads the intro.
    const cast: Cursor[] = (JSON.parse(castKey) as Collaborator[]).map((c) => ({
      ...c,
      fill: "",
      x: 0,
      y: 0,
      alpha: 0,
      press: 0,
    }));
    const [me, ...crew] = cast;
    const kicks: Kick[] = [];
    const pointer = { x: 0, y: 0, inside: false };
    const grab = { x: 0, y: 0 };
    const press = { x: 0, y: 0, time: 0, index: -1 };
    const frame = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 0, index: -1 };

    const sprite = (glyph: Glyph): Art => {
      const pad = 6;
      const left = glyph.box.x1 - pad;
      const top = glyph.box.y1 - pad;
      const image = document.createElement("canvas");
      image.width = Math.max(1, Math.ceil((glyph.box.x2 - glyph.box.x1 + pad * 2) * dpr));
      image.height = Math.max(1, Math.ceil((glyph.box.y2 - glyph.box.y1 + pad * 2) * dpr));
      const c = image.getContext("2d");
      if (!c) return { image, left, top };
      c.setTransform(dpr, 0, 0, dpr, -left * dpr, -top * dpr);
      c.font = font;
      c.letterSpacing = tracking;
      c.lineJoin = "round";
      c.lineWidth = 3;
      c.strokeStyle = ink;
      c.setLineDash([4, 2]);
      c.strokeText(glyph.word, glyph.x, glyph.baseline);
      // Keep only the outer half of the stroke: a clean silhouette.
      c.setLineDash([]);
      c.globalCompositeOperation = "destination-out";
      c.fillText(glyph.word, glyph.x, glyph.baseline);
      return { image, left, top };
    };

    // Reads where the browser put each word. A dragged word is moved with
    // relative positioning, which its offsets include, so take it back off.
    const measure = () => {
      const style = getComputedStyle(root);
      font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      tracking = style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
      ink = style.color;
      accent = style.getPropertyValue("--accent").trim() || ink;
      paper = style.getPropertyValue("--paper").trim() || "#ffffff";
      for (const c of cast) c.fill = style.getPropertyValue(c.color).trim() || ink;
      width = root.offsetWidth + PAD * 2;
      height = root.offsetHeight + PAD * 2;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.font = font;
      ctx.letterSpacing = tracking;
      const marker = root.querySelector<HTMLSpanElement>(".live-type__base");
      const spans = [...root.querySelectorAll<HTMLSpanElement>(".live-type__word")];
      const shift = marker && spans[0] ? marker.offsetTop - spans[0].offsetTop : 0;
      const previous = glyphs;
      glyphs = spans.map((el, i) => {
        const word = el.textContent ?? "";
        const m = ctx.measureText(word);
        const kept = previous[i];
        const x = el.offsetLeft - (kept?.offset.x ?? 0);
        const baseline = el.offsetTop - (kept?.offset.y ?? 0) + shift;
        return {
          el,
          word,
          x,
          baseline,
          box: {
            x1: x - m.actualBoundingBoxLeft,
            y1: baseline - m.actualBoundingBoxAscent,
            x2: x + m.actualBoundingBoxRight,
            y2: baseline + m.actualBoundingBoxDescent,
          },
          offset: kept?.offset ?? { x: 0, y: 0 },
          velocity: kept?.velocity ?? { x: 0, y: 0 },
          outline: kept?.outline ?? 0,
          dashes: null,
          styled: kept?.styled ?? "",
        };
      });
      for (const glyph of glyphs) glyph.dashes = sprite(glyph);
      frame.index = -1;
    };

    const glyphAt = (x: number, y: number) => {
      let best = -1;
      let bestDistance = Infinity;
      glyphs.forEach((glyph, i) => {
        const { x1, y1, x2, y2 } = glyph.box;
        const dx = Math.max(x1 + glyph.offset.x - x, 0, x - x2 - glyph.offset.x);
        const dy = Math.max(y1 + glyph.offset.y - y, 0, y - y2 - glyph.offset.y);
        const d = Math.hypot(dx, dy);
        if (d < bestDistance) {
          bestDistance = d;
          best = i;
        }
      });
      return bestDistance < 14 ? best : -1;
    };

    const kick = (index: number, strength: number) => {
      kicks.push({ index, at: pulse, velocity: strength });
      for (let d = 1; d < glyphs.length; d++) {
        const velocity = strength * KICK_DECAY ** d;
        if (velocity < 30) break;
        for (const j of [index - d, index + d]) {
          if (j >= 0 && j < glyphs.length)
            kicks.push({ index: j, at: pulse + d * 0.055, velocity });
        }
      }
      wake();
    };

    const blit = (art: Art | null, dx: number, dy: number) => {
      if (!art) return;
      ctx.drawImage(
        art.image,
        Math.round((art.left + dx + PAD) * dpr),
        Math.round((art.top + dy + PAD) * dpr),
      );
    };

    const crisp = (value: number) => (Math.round((value + PAD) * dpr) + 0.5) / dpr - PAD;

    const perimeterPoint = (
      distance: number,
      w: number,
      h: number,
    ): [number, number, number, number] => {
      let d = ((distance % (2 * (w + h))) + 2 * (w + h)) % (2 * (w + h));
      if (d < w) return [frame.x1 + d, frame.y1, 0, -1];
      d -= w;
      if (d < h) return [frame.x2, frame.y1 + d, 1, 0];
      d -= h;
      if (d < w) return [frame.x2 - d, frame.y2, 0, 1];
      d -= w;
      return [frame.x1, frame.y2 - d, -1, 0];
    };

    const drawSpecks = (a: number) => {
      const w = frame.x2 - frame.x1;
      const h = frame.y2 - frame.y1;
      if (w < 2 || h < 2) return;
      const perimeter = 2 * (w + h);
      const seed = frame.index + 1;
      for (let k = 0; k < SPECKS; k++) {
        const period = 0.5 + noise(seed, k, 11) * 1.2;
        const t = pulse / period + noise(seed, k, 17);
        const cycle = Math.floor(t);
        const life = t - cycle;
        if (life > 0.7) continue;
        const [px, py, nx, ny] = perimeterPoint(noise(seed, k, cycle) * perimeter, w, h);
        const pick = noise(seed, k, cycle, 2);
        const size = pick < 0.5 ? 2 : pick < 0.75 ? 3 : pick < 0.9 ? 5 : 8;
        const out = (size >= 8 ? 9 : 4) + Math.floor(noise(seed, k, cycle, 1) * 4) * 3;
        const x = px + nx * out;
        const y = py + ny * out;
        const tone = noise(seed, k, cycle, 3);
        const blink = life < 0.06 || (life > 0.32 && life < 0.36) ? 0.35 : 1;
        ctx.globalAlpha = a * (0.3 + 0.6 * tone) * blink;
        const left = Math.round(x - size / 2);
        const top = Math.round(y - size / 2);
        if (tone < 0.3 || size >= 8) ctx.strokeRect(left + 0.5, top + 0.5, size, size);
        else ctx.fillRect(left, top, size, size);
      }
      // Two pixels chase each other round the frame.
      for (let j = 0; j < 2; j++) {
        const head = (pulse * 0.42 + j * 0.5) * perimeter;
        for (let i = 0; i < 4; i++) {
          const [x, y] = perimeterPoint(head - i * 6, w, h);
          const size = i === 0 ? 3 : 2;
          ctx.globalAlpha = a * [0.95, 0.55, 0.32, 0.16][i];
          ctx.fillRect(Math.round(x - size / 2), Math.round(y - size / 2), size, size);
        }
      }
      ctx.globalAlpha = 1;
    };

    const drawFrame = (label: string) => {
      const glyph = glyphs[frame.index];
      if (!glyph || frame.alpha < 0.01) return;
      const a = frame.alpha;
      const x1 = crisp(frame.x1);
      const y1 = crisp(frame.y1);
      const x2 = crisp(frame.x2);
      const y2 = crisp(frame.y2);
      ctx.fillStyle = accent;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1;

      const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
      if (moved > 1) {
        const hx = (glyph.box.x1 + glyph.box.x2) / 2;
        const hy = (glyph.box.y1 + glyph.box.y2) / 2;
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(hx + glyph.offset.x, hy + glyph.offset.y);
        ctx.setLineDash([3, 4]);
        ctx.globalAlpha = 0.45 * a;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 0.7 * a;
        ctx.fillRect(Math.round(hx) - 2, Math.round(hy) - 2, 4, 4);
      }

      ctx.globalAlpha = 0.6 * a;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      ctx.globalAlpha = a;
      for (const [cx, cy] of [
        [x1, y1],
        [x2, y1],
        [x2, y2],
        [x1, y2],
      ]) {
        ctx.fillRect(Math.round(cx) - 2, Math.round(cy) - 2, 5, 5);
      }
      drawSpecks(a);

      ctx.font = LABEL_FONT;
      ctx.letterSpacing = LABEL_TRACKING;
      ctx.textBaseline = "bottom";
      ctx.globalAlpha = 0.75 * a;
      ctx.fillText(label, Math.round(frame.x1), Math.round(frame.y1) - 7);
      ctx.globalAlpha = 1;
      ctx.letterSpacing = tracking;
    };

    // A Figma-style pointer with a name tag, tip at the cursor's point.
    const drawCursor = (c: Cursor) => {
      if (c.alpha < 0.01) return;
      ctx.save();
      ctx.translate(Math.round(c.x), Math.round(c.y));
      const scale = 1 - 0.18 * c.press;
      ctx.scale(scale, scale);
      ctx.globalAlpha = c.alpha;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 17);
      ctx.lineTo(4.6, 12.6);
      ctx.lineTo(7.6, 19.2);
      ctx.lineTo(10.4, 18);
      ctx.lineTo(7.5, 11.6);
      ctx.lineTo(13.2, 11.6);
      ctx.closePath();
      ctx.lineJoin = "round";
      ctx.lineWidth = 2;
      ctx.strokeStyle = paper;
      ctx.stroke();
      ctx.fillStyle = c.fill;
      ctx.fill();
      ctx.font = LABEL_FONT;
      ctx.letterSpacing = LABEL_TRACKING;
      ctx.textBaseline = "middle";
      const w = ctx.measureText(c.name).width + 14;
      ctx.beginPath();
      ctx.roundRect(12, 20, w, 20, 6);
      ctx.fill();
      ctx.fillStyle = paper;
      ctx.fillText(c.name, 19, 30.5);
      ctx.restore();
    };

    const follow = (c: Cursor, x: number, y: number, show: boolean, dt: number, lag: number) => {
      if (c.alpha < 0.02) {
        c.x = x;
        c.y = y;
      }
      c.x = approach(c.x, x, dt, lag);
      c.y = approach(c.y, y, dt, lag);
      c.alpha = approach(c.alpha, show ? 1 : 0, dt, 0.12);
      c.press = approach(c.press, 0, dt, 0.12);
      const settled =
        Math.abs(c.x - x) < 0.3 &&
        Math.abs(c.y - y) < 0.3 &&
        Math.abs(c.alpha - (show ? 1 : 0)) < 0.01 &&
        c.press < 0.01;
      if (settled) {
        c.x = x;
        c.y = y;
        c.alpha = show ? 1 : 0;
        c.press = 0;
      }
      return !settled;
    };

    // Where a cursor rests on a word: just above the baseline, so its tag
    // hangs in the gap under the line. A second cursor on the same word
    // takes the word's left side.
    const rest = (glyph: Glyph, slot: number): [number, number] => [
      (slot === 0 ? glyph.box.x2 - 14 : glyph.box.x1 + (glyph.box.x2 - glyph.box.x1) * 0.28) +
        glyph.offset.x,
      glyph.baseline - 6 + glyph.offset.y,
    ];

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      pulse += dt;
      const damping = 2 * Math.sqrt(SPRING) * (1 - BOUNCE * 0.96);
      const size = glyphs.length ? glyphs[0].box.y2 - glyphs[0].box.y1 : 40;

      // Intro: the agent's frame steps along the line; the words it has
      // just passed show their outline, then fill back in behind it.
      let agent = -1;
      if (intro >= 0) {
        intro += dt;
        const at = Math.floor((intro - INTRO_DELAY) / introStep(glyphs.length));
        if (at >= glyphs.length + INTRO_TRAIL) {
          intro = -1;
          finale = 0;
        } else {
          agent = Math.min(at, glyphs.length - 1);
        }
      }
      const introducing = intro >= 0;
      const step = introducing ? Math.floor((intro - INTRO_DELAY) / introStep(glyphs.length)) : -1;
      const final = glyphs.length - 1;
      if (finale >= 0) {
        finale += dt;
        if (finale >= FINALE_CLICK && !launched) {
          launched = true;
          if (me) me.press = 1;
          kick(final, size * 6);
        }
        if (finale >= FINALE_END) finale = -1;
      }
      const shipping = finale >= 0 && finale < FINALE_CLICK + 0.25;

      for (let k = kicks.length - 1; k >= 0; k--) {
        if (kicks[k].at > pulse) continue;
        const glyph = glyphs[kicks[k].index];
        if (glyph) glyph.velocity.y -= kicks[k].velocity;
        kicks.splice(k, 1);
      }

      let moving = false;
      glyphs.forEach((glyph, i) => {
        const { offset, velocity } = glyph;
        if (i === dragging) {
          offset.x = approach(offset.x, pointer.x - grab.x, dt, 0.03);
          offset.y = approach(offset.y, pointer.y - grab.y, dt, 0.03);
          velocity.x = 0;
          velocity.y = 0;
          moving = true;
          return;
        }
        if (
          Math.abs(offset.x) < 0.05 &&
          Math.abs(offset.y) < 0.05 &&
          Math.hypot(velocity.x, velocity.y) < 0.5
        ) {
          offset.x = 0;
          offset.y = 0;
          velocity.x = 0;
          velocity.y = 0;
          return;
        }
        velocity.x += (-SPRING * offset.x - damping * velocity.x) * dt;
        velocity.y += (-SPRING * offset.y - damping * velocity.y) * dt;
        offset.x += velocity.x * dt;
        offset.y += velocity.y * dt;
        moving = true;
      });

      const hover =
        pointer.inside && !introducing && finale < 0 ? glyphAt(pointer.x, pointer.y) : -1;
      const focus = introducing ? agent : shipping ? final : dragging >= 0 ? dragging : hover;
      if (focus >= 0) {
        const glyph = glyphs[focus];
        const bx1 = glyph.box.x1 + glyph.offset.x - 6;
        const by1 = glyph.box.y1 + glyph.offset.y - 6;
        const bx2 = glyph.box.x2 + glyph.offset.x + 6;
        const by2 = glyph.box.y2 + glyph.offset.y + 6;
        if (frame.index < 0 || frame.alpha < 0.02) {
          frame.x1 = bx1;
          frame.y1 = by1;
          frame.x2 = bx2;
          frame.y2 = by2;
        }
        const glide = focus === dragging ? 0.02 : introducing ? 0.07 : 0.08;
        frame.x1 = approach(frame.x1, bx1, dt, glide);
        frame.y1 = approach(frame.y1, by1, dt, glide);
        frame.x2 = approach(frame.x2, bx2, dt, glide);
        frame.y2 = approach(frame.y2, by2, dt, glide);
        frame.index = focus;
      }
      frame.alpha = approach(frame.alpha, focus >= 0 ? 1 : 0, dt, 0.1);
      if (frame.alpha > 0.01 && frame.alpha < 0.99) moving = true;

      // During the intro the lead agent sits on the frame's corner handle and
      // the others trail behind; the author then clicks the last word, and
      // after that everyone rests on their own word.
      const show = !introducing || agent >= 0;
      const parking = !introducing && !(finale >= 0 && finale < FINALE_END);
      const slots = new Map<string, number>();
      cast.forEach((c, k) => {
        const lag = k === 0 ? 0.16 : 0.14;
        let target: [number, number] | null = null;
        if (parking) {
          const home = glyphs.findIndex((glyph) => glyph.word === c.park);
          if (home >= 0) {
            const slot = slots.get(c.park) ?? 0;
            slots.set(c.park, slot + 1);
            target = rest(glyphs[home], slot);
          }
        } else if (introducing && c === crew[0]) {
          const lead = glyphs[Math.max(0, agent)];
          target = [lead.box.x2 + 5, lead.box.y2 + 5];
        } else if (introducing) {
          const behind = c === me ? 3 : crew.indexOf(c);
          target = rest(glyphs[Math.max(0, agent - behind)], 0);
        } else if (c === me) {
          const end = glyphs[final];
          target = [(end.box.x1 + end.box.x2) / 2, (end.box.y1 + end.box.y2) / 2];
        }
        // The other agents hold still while the author ships the line.
        target ??= [c.x, c.y];
        const glide = parking ? 0.3 : c === crew[0] ? 0.08 : lag;
        if (follow(c, target[0], target[1], show, dt, glide)) moving = true;
      });

      glyphs.forEach((glyph, i) => {
        const target = introducing
          ? i <= step && step < i + INTRO_TRAIL
            ? 1
            : 0
          : i === focus && i !== dragging
            ? 1
            : 0;
        glyph.outline = approach(glyph.outline, target, dt, introducing ? 0.12 : 0.09);
        if (Math.abs(glyph.outline - target) > 0.002) moving = true;
        else glyph.outline = target;
        const styled = `${glyph.offset.x.toFixed(1)} ${glyph.offset.y.toFixed(1)} ${glyph.outline.toFixed(3)}`;
        if (styled !== glyph.styled) {
          glyph.styled = styled;
          const still = glyph.offset.x === 0 && glyph.offset.y === 0;
          glyph.el.style.left = still ? "" : `${glyph.offset.x}px`;
          glyph.el.style.top = still ? "" : `${glyph.offset.y}px`;
          glyph.el.style.opacity = glyph.outline === 0 ? "" : String(1 - glyph.outline);
        }
      });

      const nextCursor = dragging >= 0 ? "grabbing" : hover >= 0 ? "grab" : "";
      if (nextCursor !== cursor) {
        cursor = nextCursor;
        root.style.cursor = nextCursor;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // A dashed ghost stays home while a word is away.
      for (const glyph of glyphs) {
        const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
        if (moved > 1) {
          ctx.globalAlpha = Math.min(1, moved / 24) * 0.45;
          blit(glyph.dashes, 0, 0);
        }
        if (glyph.outline > 0.001) {
          ctx.globalAlpha = glyph.outline;
          blit(glyph.dashes, glyph.offset.x, glyph.offset.y);
        }
      }
      ctx.globalAlpha = 1;
      ctx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr);
      const active = glyphs[frame.index];
      if (active) {
        const moved = Math.hypot(active.offset.x, active.offset.y);
        const typed = Math.max(0, intro - INTRO_DELAY - frame.index * introStep(glyphs.length));
        const prompt = lines[frame.index] ?? `ai · ${active.word}`;
        const shown = prompt.slice(0, Math.floor(typed * TYPE_RATE));
        const caret = shown.length < prompt.length || pulse % 0.8 < 0.4 ? "_" : " ";
        const label = introducing
          ? shown + caret
          : finale >= 0
            ? `${me?.name ?? "you"} · ship it`
            : moved > 1
              ? `${signed(Math.round(active.offset.x))}, ${signed(Math.round(-active.offset.y))}`
              : `${active.word}  ${Math.round(active.box.x2 - active.box.x1)} × ${Math.round(active.box.y2 - active.box.y1)}`;
        drawFrame(label);
      }
      for (const c of [...cast].reverse()) drawCursor(c);

      const busy = moving || introducing || finale >= 0 || kicks.length > 0 || focus >= 0;
      if (busy && visible && alive) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (raf || !visible || !alive || !ready) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const locate = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onMove = (e: PointerEvent) => {
      locate(e);
      pointer.inside = true;
      wake();
    };
    const onLeave = () => {
      if (dragging >= 0) return;
      pointer.inside = false;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      locate(e);
      pointer.inside = true;
      const primary = e.pointerType !== "mouse" || e.button === 0;
      const index = intro >= 0 || !primary ? -1 : glyphAt(pointer.x, pointer.y);
      press.x = pointer.x;
      press.y = pointer.y;
      press.time = performance.now();
      press.index = index;
      if (index >= 0) {
        dragging = index;
        grab.x = pointer.x - glyphs[index].offset.x;
        grab.y = pointer.y - glyphs[index].offset.y;
        root.setPointerCapture?.(e.pointerId);
      }
      wake();
    };
    const onUp = (e: PointerEvent) => {
      if (dragging >= 0) {
        dragging = -1;
        root.releasePointerCapture?.(e.pointerId);
        const rect = root.getBoundingClientRect();
        pointer.inside =
          e.pointerType === "mouse" &&
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
      }
      const tap = performance.now() - press.time < 450;
      const still = Math.hypot(pointer.x - press.x, pointer.y - press.y) < 6;
      if (e.type === "pointerup" && press.index >= 0 && tap && still && !reducedMotion) {
        const glyph = glyphs[press.index];
        kick(press.index, (glyph.box.y2 - glyph.box.y1) * 11);
      }
      press.index = -1;
      wake();
    };

    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerenter", onMove, { passive: true });
    root.addEventListener("pointerdown", onDown, { passive: true });
    root.addEventListener("pointerup", onUp, { passive: true });
    root.addEventListener("pointercancel", onUp, { passive: true });
    root.addEventListener("pointerleave", onLeave, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      if (!ready) return;
      measure();
      wake();
    });
    resizeObserver.observe(root);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    intersectionObserver.observe(root);
    const start = () => {
      if (!alive) return;
      ready = true;
      measure();
      wake();
    };
    // A canvas never asks for a font, so load the label's mono face first.
    if (document.fonts)
      document.fonts
        .load(LABEL_FONT)
        .then(() => document.fonts.ready)
        .then(start, start);
    else start();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      root.style.cursor = "";
      for (const glyph of glyphs) {
        glyph.el.style.left = "";
        glyph.el.style.top = "";
        glyph.el.style.opacity = "";
      }
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerenter", onMove);
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointercancel", onUp);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [text, promptKey, castKey]);

  return (
    <span ref={rootRef} className={`live-type ${className}`.trim()}>
      <span className="live-type__base" />
      {words.map((word, w) => (
        <span key={w}>
          {w > 0 && " "}
          <span className="live-type__word">{word}</span>
        </span>
      ))}
      <canvas ref={canvasRef} className="live-type__canvas" aria-hidden="true" />
    </span>
  );
}
