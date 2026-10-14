type CursorProps = { name: string; tone: "you" | "agent" | "mcp"; x: number; y: number };

// A collaborator cursor with a name tag, positioned inside a relative parent.
export function Cursor({ name, tone, x, y }: CursorProps) {
  return (
    <span className={`cursor cursor--${tone}`} style={{ left: x, top: y }}>
      <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
        <path
          d="M1.2 1.2 12.6 7.4 7.4 8.9 4.9 14.4Z"
          fill="currentColor"
          stroke="#fff"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <b>{name}</b>
    </span>
  );
}
