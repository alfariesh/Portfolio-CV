import { useEffect, useState } from "react";
import { nav, type NavItem } from "../content";
import { useRouter } from "../router/context";

// A section runs from its anchor to the next one, so the nav follows the page
// even where a section is taller than its heading cell. The last one runs to
// the end of the page, footer included; only above the first is it plain home.
const sections = nav.map((item) => item.href.slice(2));

// Where on screen a section counts as the one being read.
const READING_LINE = 0.4;

function useHomeSection(active: boolean) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = window.innerHeight * READING_LINE;
      let found: string | null = null;
      let top = -Infinity;
      for (const anchor of sections) {
        const rect = document.getElementById(anchor)?.getBoundingClientRect();
        if (rect && rect.top <= line && rect.top > top) {
          found = anchor;
          top = rect.top;
        }
      }
      setId(found);
    };
    // At most one layout read per frame, however often scroll fires.
    const update = () => {
      frame ||= requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [active]);

  return active ? id : null;
}

// Which nav item is current. On home it is the section being read; elsewhere
// it is the item whose index page the path sits under (/work, /work/numi).
export function useNavCurrent() {
  const { pathname } = useRouter();
  const onHome = pathname === "/";
  const section = useHomeSection(onHome);
  const top = `/${pathname.split("/")[1]}`;

  const current = (item: NavItem): "location" | "page" | undefined => {
    if (onHome) return section === item.href.slice(2) ? "location" : undefined;
    return item.page === top ? "page" : undefined;
  };

  return { current, onHome, section };
}
