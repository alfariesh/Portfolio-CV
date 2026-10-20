import type { esc, Frame, kernel, Point3, slits } from "./kernel";

export type IsoApi = {
  iso: {
    /** Frame the scene at the host's aspect ratio (4:3 or 3:2). */
    frame: (points: Point3[], margin?: number) => Frame;
    kernel: typeof kernel;
    slits: typeof slits;
    esc: typeof esc;
  };
  /** Terse, lowercase status under the figure, e.g. "on · 3 sets". */
  readout: (text: string) => void;
  /** Timers and frame loops, all cleared when the figure unmounts. */
  after: (ms: number, fn: () => void) => void;
  every: (ms: number, fn: () => void) => void;
  loop: (fn: (now: number) => void) => () => void;
  /** Press and light a `.press` group briefly. */
  flash: (el: Element | null, ms?: number) => void;
  /** Restart a one-shot CSS animation, e.g. a `.pulse` along a wire. */
  replay: (el: Element | null, cls?: string) => void;
  /** Warm haze behind the figure while it is on. */
  power: (on: boolean) => void;
};

export type IsoHandle = {
  /** Return true when the key was handled. */
  key?: (event: KeyboardEvent) => boolean;
  keyup?: (event: KeyboardEvent) => void;
  unmount?: () => void;
  /** A short scripted run that leaves the figure lit. */
  demo?: () => void;
};

// One figure, as in the iso-glow skill's figure contract. Prefix every element
// id and every CSS selector with the figure id.
export type IsoFig = {
  id: string;
  name: string;
  hint: string;
  aria: string;
  /** Extra CSS, scoped with [data-fig="<id>"]. */
  css?: string;
  mount: (stage: SVGSVGElement, api: IsoApi) => IsoHandle | void;
};
