import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

type ScalerProps = {
  width: number;
  height: number;
  className?: string;
  label?: string;
  children: ReactNode;
};

// Renders children at a fixed design size and scales them down to fit the
// available width, so detailed illustrations keep their proportions on phones.
export function Scaler({ width, height, className, label, children }: ScalerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Measure before the first paint so large artwork never flashes at full size.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = (available: number) => setScale(Math.min(1, available / width));
    fit(el.clientWidth);
    const observer = new ResizeObserver(([entry]) => fit(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div
      ref={ref}
      className={["scaler", className].filter(Boolean).join(" ")}
      style={{ height: height * scale, maxWidth: width }}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      <div
        className="scaler__inner"
        style={{ width, height, transform: `scale(${scale})` }}
        aria-hidden={label ? true : undefined}
      >
        {children}
      </div>
    </div>
  );
}
