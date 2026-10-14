const paths = {
  pointer: "M5 3l13 7-6 1.5L9 18Z",
  hand: "M8 12V5.5a1.5 1.5 0 0 1 3 0V11m0-6.5a1.5 1.5 0 0 1 3 0V11m0-4.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-1a5 5 0 0 1-4-2l-3-4a1.5 1.5 0 0 1 2.3-2L8 14",
  frame: "M7 3v18M17 3v18M3 7h18M3 17h18",
  rect: "M5 5h14v14H5Z",
  pen: "M4 20l3-1 11-11-2-2L5 17Z M14 6l2 2",
  text: "M5 6V4h14v2 M12 4v16 M9 20h6",
  file: "M6 3h8l4 4v14H6Z M14 3v4h4",
  panel: "M4 5h16v14H4Z M9 5v14",
  chevron: "M7 10l5 5 5-5",
  plus: "M12 5v14M5 12h14",
  check: "M5 12.5l4.5 4.5L19 7.5",
  page: "M7 3h7l4 4v14H7Z",
  artboard: "M8 4v16M16 4v16M4 8h16M4 16h16",
  eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z",
  search: "M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Z M15.5 15.5 20 20",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  home: "M4 11l8-7 8 7v9H4Z M10 20v-5h4v5",
  grid: "M4 4h7v7H4Z M13 4h7v7h-7Z M4 13h7v7H4Z M13 13h7v7h-7Z",
  user: "M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z M4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5",
  close: "M6 6l12 12M18 6 6 18",
  arrow: "M5 12h14M13 6l6 6-6 6",
  bolt: "M13 3 5 13.5h6L10 21l8-10.5h-6Z",
} as const;

export type IconName = keyof typeof paths;

type IconProps = { name: IconName; size?: number; strokeWidth?: number; className?: string };

export function Icon({ name, size = 16, strokeWidth = 1.6, className }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
