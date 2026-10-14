// A small pictogram family drawn on a shared 24px grid with one stroke weight.
export const pictograms = {
  leaf: "M5 19c0-8 5-14 14-14 0 9-6 14-14 14Z M5 19l7-7",
  drop: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z",
  truck:
    "M2.5 6.5h11v9h-11Z M13.5 10h4l3 3v2.5h-7 M6 17.5a1.75 1.75 0 1 0 0 .01 M17 17.5a1.75 1.75 0 1 0 0 .01",
  factory: "M3 20V10.5l5 3v-3l5 3V6h3l.8-3h2.4l.8 3v14Z M7 17h2 M12 17h2",
  sack: "M9 3.5h6l-1.6 3c3.7 1.7 5.6 5.5 5.6 8.7A4.8 4.8 0 0 1 14.2 20H9.8A4.8 4.8 0 0 1 5 15.2c0-3.2 1.9-7 5.6-8.7Z M10 12.5h4",
  chart: "M4 4v16h16 M8.5 16v-4 M12.5 16V8 M16.5 16v-6",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z M12 2.5v2 M12 19.5v2 M2.5 12h2 M19.5 12h2 M5.3 5.3l1.4 1.4 M17.3 17.3l1.4 1.4 M5.3 18.7l1.4-1.4 M17.3 6.7l1.4-1.4",
  pin: "M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11Z M12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z",
  shield: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z M9 12l2 2 4-4",
  box: "M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4Z M3.5 7.5 12 11.5l8.5-4 M12 11.5v9",
  person: "M12 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z M5 20c1-3.8 3.8-6 7-6s6 2.2 7 6",
  calendar: "M4 6h16v14H4Z M4 10.5h16 M8.5 3.5v4 M15.5 3.5v4",
  doc: "M6 3h8l4 4v14H6Z M14 3v4h4 M9 14l2 2 4-4",
  sprout:
    "M12 21v-9 M12 12c0-4-3-6.5-7-6.5 0 4 3 6.5 7 6.5Z M12 10c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5Z",
  chat: "M4 5h16v11H10l-6 4Z M8.5 10.5h7",
  scale: "M12 4v16 M7 20h10 M5 7h14 M5 7l-2.5 6h5Z M19 7l-2.5 6h5Z",
} as const;

export type PictogramName = keyof typeof pictograms;

export const pictogramNames = Object.keys(pictograms) as PictogramName[];
