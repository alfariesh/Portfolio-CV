// One pointer for every cursor on the site: the collaborators on the hero
// headline (drawn on a canvas by LiveType), the ones in the hero's design-tool
// mock (DOM, `Cursor.tsx`) and the visitor's own "You". Both renderers read
// these numbers, so the cursors can't drift apart.
//
// The arrow is the solid Hugeicons "cursor-02" on its 24-unit grid. A paper
// outline (painted under the fill, so about half of it shows) and a thin soft
// shadow are added around it, and a name tag hangs below-right of the tip.
export const CURSOR = {
  path: "M16.1693 6.31519C17.859 6.97633 19.2002 7.50114 20.1062 8.00038C20.5659 8.25371 20.9743 8.53206 21.2679 8.86428C21.5787 9.21615 21.7747 9.64698 21.7476 10.1529C21.7205 10.6606 21.4774 11.0686 21.1294 11.3851C20.8007 11.684 20.3627 11.9177 19.8756 12.1213C18.9153 12.5229 17.5161 12.9044 15.7522 13.3855C15.1976 13.5368 14.7717 13.6537 14.4965 13.7584C14.2362 13.8573 14.1129 13.9401 14.0268 14.0263C13.9406 14.1124 13.8578 14.2357 13.7589 14.496C13.6542 14.7712 13.5372 15.1971 13.386 15.7517C12.9049 17.5157 12.5234 18.9148 12.1218 19.8751C11.9182 20.3622 11.6845 20.8002 11.3856 21.129C11.0691 21.477 10.6611 21.72 10.1534 21.7471C9.64747 21.7742 9.21663 21.5782 8.86477 21.2674C8.53255 20.9738 8.2542 20.5654 8.00087 20.1057C7.50162 19.1997 6.97682 17.8585 6.31568 16.1688L3.90685 10.0129C3.21476 8.24433 2.6645 6.83816 2.4112 5.75959C2.15983 4.6893 2.12638 3.64149 2.88418 2.88369C3.64198 2.1259 4.68978 2.15935 5.76008 2.41071C6.83865 2.66401 8.24481 3.21427 10.0134 3.90636L10.0134 3.90636L16.1693 6.31519Z",
  /** The path's grid, in units. */
  box: 24,
  /** Pixels the grid is drawn at. */
  size: 20,
  /** Where the arrow's tip sits on the grid, from the top-left corner. */
  tip: 2.884,
  /** Outline width in grid units. */
  outline: 2.4,
  /** A thin, soft drop shadow in pixels (alpha 0–1). */
  shadow: { y: 1, blur: 2, alpha: 0.25 },
  /** The tag's text: mono, in pixels. */
  label: { size: 11, tracking: 1.2 },
  /** The name tag, in pixels from the tip. */
  tag: { x: 14, y: 17, height: 20, radius: 6, padX: 7 },
} as const;

/** Pixels from the drawn grid's corner to the tip, so the tip lands on the point. */
export const tipOffset = (CURSOR.tip * CURSOR.size) / CURSOR.box;
