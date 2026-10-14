// Paper-sheet backdrop: zig-zag folds, a faint layout grid and edge rulers.
export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__grid" />
      <div className="backdrop__folds" />
      <div className="backdrop__ruler backdrop__ruler--y" />
      <div className="backdrop__ruler backdrop__ruler--x" />
    </div>
  );
}
