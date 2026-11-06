import type { CSSProperties, Ref } from "react";
import { CURSOR, tipOffset } from "./cursor-shape";

type CursorProps = {
  name: string;
  /** A colour token on the page, like "--accent". */
  color: string;
  /** Where the tip points, inside a positioned parent. */
  x?: number;
  y?: number;
  className?: string;
  ref?: Ref<HTMLSpanElement>;
};

// A collaborator cursor with a name tag. The element's corner sits on the point
// the arrow's tip touches (its box is one arrow big, which also gives a view
// transition something to snapshot); LiveType draws the same cursor on its
// canvas from the same `CURSOR` numbers.
export function Cursor({ name, color, x = 0, y = 0, className, ref }: CursorProps) {
  const { tag, shadow, label } = CURSOR;
  return (
    <span
      ref={ref}
      className={className ? `cursor ${className}` : "cursor"}
      style={
        {
          "--c": `var(${color})`,
          left: x,
          top: y,
          width: CURSOR.size,
          height: CURSOR.size,
          filter: `drop-shadow(0 ${shadow.y}px ${shadow.blur}px rgb(0 0 0 / ${shadow.alpha}))`,
        } as CSSProperties
      }
    >
      <svg
        width={CURSOR.size}
        height={CURSOR.size}
        viewBox={`0 0 ${CURSOR.box} ${CURSOR.box}`}
        style={{ left: -tipOffset, top: -tipOffset }}
        aria-hidden="true"
      >
        <path d={CURSOR.path} strokeWidth={CURSOR.outline} />
      </svg>
      <b
        style={{
          left: tag.x,
          top: tag.y,
          height: tag.height,
          fontSize: label.size,
          lineHeight: `${tag.height}px`,
          letterSpacing: label.tracking,
          padding: `0 ${tag.padX}px`,
          borderRadius: tag.radius,
        }}
      >
        {name}
      </b>
    </span>
  );
}
