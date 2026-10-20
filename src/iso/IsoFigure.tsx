import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  ViewTransition,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { esc, frame, kernel, slits } from "./kernel";
import type { IsoApi, IsoFig, IsoHandle } from "./types";

type IsoFigureProps = {
  fig: IsoFig;
  /** 4:3 for project art, 3:2 for note covers and cards. */
  aspect?: number;
  /** Focusable and clickable, with the hint and a live readout underneath. */
  interactive?: boolean;
  /** When the figure plays its demo: on mount, once it scrolls into view, or never. */
  demo?: "mount" | "visible" | "none";
  /** Shared view-transition name, so the plate travels between pages. */
  name?: string;
  className?: string;
};

// Hosts one iso-glow figure. The figure draws itself in a layout effect, so it
// is on screen before the first paint and inside a view transition's capture.
export function IsoFigure({
  fig,
  aspect = 4 / 3,
  interactive = false,
  demo = "visible",
  name,
  className,
}: IsoFigureProps) {
  const holderRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<SVGSVGElement>(null);
  const handle = useRef<IsoHandle>({});
  const [readout, setReadout] = useState("");
  const hintId = useId();

  useLayoutEffect(() => {
    const holder = holderRef.current;
    const stage = stageRef.current;
    if (!holder || !stage) return;

    const timers: number[] = [];
    const loops: (() => void)[] = [];
    const flashes = new Map<Element, number[]>();
    // Figures tween from `now - t0`, so with reduced motion a clock far ahead
    // lands every tween on its last frame at once. CSS animations stop in
    // iso.css; the lights and the demo still run.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = (now: number) => (reduced ? now + 1e7 : now);

    const api: IsoApi = {
      iso: { frame: (points, margin) => frame(points, margin, aspect), kernel, slits, esc },
      readout: interactive ? setReadout : () => {},
      after: (ms, fn) => {
        timers.push(window.setTimeout(fn, ms));
      },
      every: (ms, fn) => {
        timers.push(window.setInterval(fn, ms));
      },
      loop: (fn) => {
        let alive = true;
        const tick = (now: number) => {
          if (!alive) return;
          fn(clock(now));
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        const stop = () => {
          alive = false;
        };
        loops.push(stop);
        return stop;
      },
      flash: (el, ms = 160) => {
        if (!el) return;
        flashes.get(el)?.forEach((t) => clearTimeout(t));
        el.classList.add("down", "lit");
        flashes.set(el, [
          window.setTimeout(() => el.classList.remove("down"), 110),
          window.setTimeout(() => el.classList.remove("lit"), ms),
        ]);
      },
      replay: (el, cls = "go") => {
        if (!el) return;
        el.classList.remove(cls);
        void el.getBoundingClientRect();
        el.classList.add(cls);
      },
      power: (on) => {
        holder.classList.toggle("is-on", on);
      },
    };

    handle.current = fig.mount(stage, api) ?? {};

    let observer: IntersectionObserver | undefined;
    const play = () => api.after(120, () => handle.current.demo?.());
    if (demo === "mount") play();
    if (demo === "visible") {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer?.disconnect();
          play();
        },
        { threshold: 0.4 },
      );
      observer.observe(holder);
    }

    return () => {
      observer?.disconnect();
      timers.forEach((t) => {
        clearTimeout(t);
        clearInterval(t);
      });
      loops.forEach((stop) => stop());
      flashes.forEach((list) => list.forEach((t) => clearTimeout(t)));
      handle.current.unmount?.();
      handle.current = {};
      stage.replaceChildren();
      holder.classList.remove("is-on");
    };
  }, [fig, aspect, interactive, demo]);

  const onKeyDown = (event: ReactKeyboardEvent<SVGSVGElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (handle.current.key?.(event.nativeEvent)) event.preventDefault();
  };

  const plate = (
    <div ref={holderRef} className="iso__plate" style={{ aspectRatio: aspect }}>
      <svg
        ref={stageRef}
        className="iso__stage"
        data-fig={fig.id}
        // A live figure takes focus and keys, so it's a group with a hint, not
        // an image (an img role hides its interactivity from screen readers).
        role={interactive ? "group" : "img"}
        aria-roledescription={interactive ? "interactive figure" : undefined}
        aria-label={fig.aria}
        aria-describedby={interactive ? hintId : undefined}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={interactive ? onKeyDown : undefined}
        onKeyUp={interactive ? (event) => handle.current.keyup?.(event.nativeEvent) : undefined}
      />
    </div>
  );

  return (
    <figure
      className={["iso", interactive ? "iso--live" : "iso--still", className]
        .filter(Boolean)
        .join(" ")}
    >
      {fig.css && (
        <style href={`iso-${fig.id}`} precedence="iso">
          {fig.css}
        </style>
      )}
      {name ? (
        <ViewTransition name={name} share="morph" default="none">
          {plate}
        </ViewTransition>
      ) : (
        plate
      )}
      {interactive && (
        <figcaption className="iso__cap">
          <span id={hintId}>{fig.hint}</span>
          <span className="iso__readout" aria-live="polite">
            {readout}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
