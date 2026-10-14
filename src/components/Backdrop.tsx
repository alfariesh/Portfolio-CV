import { lazy, Suspense } from "react";

const PaperFibre = lazy(() => import("./PaperFibre"));

// Paper-sheet backdrop: zig-zag folds, edge rulers and the paper fibre.
export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__folds" />
      <div className="backdrop__clip">
        <Suspense fallback={null}>
          <PaperFibre className="backdrop__paper" paper="#FFFFFF" shadow="#C9CBC1" />
        </Suspense>
      </div>
      <div className="backdrop__ruler backdrop__ruler--y" />
      <div className="backdrop__ruler backdrop__ruler--x" />
    </div>
  );
}
