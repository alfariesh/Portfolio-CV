type MarkProps = { size?: number; color?: string };

// Blocky "s" monogram drawn on a 21px pixel grid.
export function Mark({ size = 21, color = "var(--accent)" }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 21 21" aria-hidden="true">
      <path d="M0 0H21V5H5V8H21V21H0V16H16V13H0Z" fill={color} shapeRendering="crispEdges" />
    </svg>
  );
}
