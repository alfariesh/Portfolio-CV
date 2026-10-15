import { useEffect, useState } from "react";
import { nav } from "../content";
import { useRouter } from "../router/context";
import { Link } from "../router/Link";
import { Icon } from "./Icon";
import { ProgressiveBlur } from "./ProgressiveBlur";

// Sections the bar can highlight.
const sections = nav.filter((item) => item.href.startsWith("/#")).map((item) => item.href.slice(2));

const items = [{ label: "home", href: "/", icon: "home" }, ...nav] as const;

// Anchors on the home page. A section runs from its anchor to the next one, so
// the bar follows the page even where a section is taller than its heading cell.
const anchors = ["work", "systems", "process", "contact", "about"];

function useHomeSection(active: boolean) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    const update = () => {
      const middle = window.innerHeight / 2;
      let found: string | null = null;
      for (const anchor of anchors) {
        const rect = document.getElementById(anchor)?.getBoundingClientRect();
        if (rect && rect.top <= middle) found = anchor;
      }
      // "about" is a single cell; below it the page is plain home again.
      if (
        found === "about" &&
        document.getElementById("about")!.getBoundingClientRect().bottom < middle
      ) {
        found = null;
      }
      setId(sections.includes(found ?? "") ? found : null);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [active]);

  return active ? id : null;
}

// Small screens hide the header links, so the same destinations sit in a bar
// pinned to the bottom: icons only, over a progressive blur of the page.
export function BottomNav() {
  const { pathname } = useRouter();
  const section = pathname.split("/")[1];
  const homeSection = useHomeSection(pathname === "/");

  return (
    <nav className="bottom-nav" aria-label="Primary">
      <ProgressiveBlur className="bottom-nav__blur" />
      <ul className="bottom-nav__list">
        {items.map((item) => {
          const hash = item.href.startsWith("/#") ? item.href.slice(2) : null;
          const current = hash
            ? homeSection === hash
            : item.href === "/"
              ? pathname === "/" && homeSection === null
              : item.href === `/${section}`;
          return (
            <li key={item.href}>
              <Link
                className="bottom-nav__link"
                href={item.href}
                aria-label={item.label}
                aria-current={current ? (hash ? "location" : "page") : undefined}
              >
                <Icon name={item.icon} size={22} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
