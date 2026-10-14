import { lazy } from "react";
import { ClientOnly } from "./ClientOnly";

const PaperFibre = lazy(() => import("./PaperFibre"));

// Paper-sheet backdrop: zig-zag folds, edge rulers and the paper fibre.
export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__folds" />
      <div className="backdrop__clip">
        <ClientOnly>
          <PaperFibre className="backdrop__paper" paper="#FFFFFF" shadow="#C9CBC1" />
        </ClientOnly>
      </div>
      <div className="backdrop__ruler backdrop__ruler--y" />
      <div className="backdrop__ruler backdrop__ruler--x" />
    </div>
  );
}
