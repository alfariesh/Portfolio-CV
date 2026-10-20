import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";

type ScalerProps = {
  width: number;
  height: number;
  className?: string;
  label?: string;
  /** Also scale up past the design size to fill wider containers. */
  grow?: boolean;
  children: ReactNode;
};

// Renders children at a fixed design size and scales them to fit the available
// width, so detailed illustrations keep their proportions on phones. The box
// takes its height from `aspect-ratio`, so the page has its final height
// before any script runs, and CSS scales it too where it can (index.css).
export function Scaler({ width, height, className, label, grow, children }: ScalerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Write the scale straight to the DOM before the first paint. A state update
  // here would land after a view transition has captured the new page.
  useLayoutEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    const fit = (available: number) => {
      const scale = grow ? available / width : Math.min(1, available / width);
      inner.style.scale = String(scale);
    };
    fit(el.clientWidth);
    const observer = new ResizeObserver(([entry]) => fit(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, [width, grow]);

  return (
    <div
      ref={ref}
      className={["scaler", className].filter(Boolean).join(" ")}
      style={
        {
          aspectRatio: `${width} / ${height}`,
          maxWidth: grow ? undefined : width,
          "--scaler-width": `${width}px`,
        } as CSSProperties
      }
      role={label ? "img" : undefined}
      aria-label={label}
    >
      <div
        ref={innerRef}
        className="scaler__inner"
        style={{ width, height }}
        aria-hidden={label ? true : undefined}
      >
        {children}
      </div>
    </div>
  );
}
