import { useEffect, useRef, useState } from "react";
import { Cursor } from "./Cursor";

// The visitor's own cursor, on every page: it follows a mouse (not touch) over
// the whole window and takes the system cursor's place, drawn like the
// collaborators' on the hero. It is fixed to the viewport and writes its
// position to the DOM directly, so moving the mouse never re-renders anything.
// Nothing is rendered (or prerendered) until a mouse has moved, and the class
// on <html> that hides the system cursor is only set while this one is shown.
export function YouCursor({ name, color }: { name: string; color: string }) {
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const point = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    const root = document.documentElement;
    const place = () => {
      if (el) el.style.translate = `${point.current.x}px ${point.current.y}px`;
    };
    const show = (on: boolean) => {
      el?.classList.toggle("is-on", on);
      root.classList.toggle("has-you-cursor", on);
      if (!on) el?.classList.remove("is-down");
    };
    const onMove = (e: PointerEvent) => {
      // Touch and pen have no system cursor to replace.
      if (e.pointerType !== "mouse") {
        show(false);
        return;
      }
      point.current.x = e.clientX;
      point.current.y = e.clientY;
      if (!el) {
        setSeen(true);
        return;
      }
      place();
      show(true);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") el?.classList.add("is-down");
    };
    const onUp = () => el?.classList.remove("is-down");
    const onLeave = () => show(false);

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointercancel", onUp, { passive: true });
    root.addEventListener("mouseleave", onLeave, { passive: true });
    // The first mouse move rendered the cursor: put it where the mouse is.
    if (el) {
      place();
      show(true);
    }
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      root.removeEventListener("mouseleave", onLeave);
      show(false);
    };
  }, [seen]);

  return seen ? <Cursor ref={ref} className="cursor--you" name={name} color={color} /> : null;
}
