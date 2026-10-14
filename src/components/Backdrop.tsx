// Paper-sheet backdrop: zig-zag folds and edge rulers.
export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__folds" />
      <div className="backdrop__ruler backdrop__ruler--y" />
      <div className="backdrop__ruler backdrop__ruler--x" />
    </div>
  );
}
