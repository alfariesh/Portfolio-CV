import type { CSSProperties } from "react";

type ProgressiveBlurProps = {
  className?: string;
  /** Which edge of the parent the strongest blur sits on. */
  position?: "top" | "bottom";
  /** One backdrop-filter layer per level, softest first. */
  blurLevels?: number[];
};

// A stack of backdrop-filter layers, each masked to its own band, so the blur
// ramps from none to the strongest level instead of starting at a hard edge.
// Fills its (positioned) parent and never takes pointer events.
export function ProgressiveBlur({
  className,
  position = "bottom",
  blurLevels = [1, 2, 4, 8, 16, 24, 32],
}: ProgressiveBlurProps) {
  const count = blurLevels.length;
  const step = 100 / count;
  const direction = position === "bottom" ? "to bottom" : "to top";
  const clear = "rgba(0,0,0,0)";
  const solid = "rgba(0,0,0,1)";

  return (
    <div className={["progressive-blur", className].filter(Boolean).join(" ")} aria-hidden="true">
      {blurLevels.map((blur, index) => {
        const stops =
          index === count - 1
            ? `${clear} ${index * step}%, ${solid} 100%`
            : `${clear} ${index * step}%, ${solid} ${(index + 1) * step}%, ${solid} ${Math.min(100, (index + 2) * step)}%, ${clear} ${Math.min(100, (index + 3) * step)}%`;
        const mask = `linear-gradient(${direction}, ${stops})`;
        const style: CSSProperties = {
          zIndex: index + 1,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          maskImage: mask,
          WebkitMaskImage: mask,
        };
        return <div key={blur} className="progressive-blur__layer" style={style} />;
      })}
    </div>
  );
}
