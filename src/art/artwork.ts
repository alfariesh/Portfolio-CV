// Project illustrations: design size and accessible label. Rendered by
// <ProjectArt>, which also links each one to its case study hero.
export const artwork = {
  phones: {
    width: 1080,
    height: 780,
    label: "Three mobile screens: Vuboi home, Chicken Bank savings goal and Numi onboarding.",
  },
  systems: {
    width: 1080,
    height: 840,
    label:
      "The Rekanesia pictogram set on a 24 pixel grid, one icon enlarged with keylines, and a row of status chips.",
  },
  loop: {
    width: 1080,
    height: 780,
    label:
      "Design tokens on a canvas next to the same tokens as CSS in a code editor, connected by get_jsx and sync tokens arrows.",
  },
} as const;

export type ArtKey = keyof typeof artwork;
