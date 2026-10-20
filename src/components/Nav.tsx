import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { nav, profile } from "../content";
import { Link } from "../router/Link";
import { Icon } from "./Icon";
import { Mark } from "./Mark";
import { useNavCurrent } from "./useNavCurrent";

// True once the page has scrolled past the top, when the header tucks in to
// the width of the content grid.
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);
  return scrolled;
}

// Moves the pill behind the current link. It snaps into place when it appears
// and slides from one link to the next after that.
function usePill(key: string | undefined) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const list = ref.current;
    if (!list) return;
    const place = () => {
      const link = list.querySelector<HTMLElement>("[aria-current]");
      if (!link) {
        delete list.dataset.pill;
        return;
      }
      list.style.setProperty("--pill-x", `${link.offsetLeft}px`);
      list.style.setProperty("--pill-w", `${link.offsetWidth}px`);
      if (list.dataset.pill === "on") return;
      list.dataset.pill = "enter";
      requestAnimationFrame(() => {
        if (list.dataset.pill === "enter") list.dataset.pill = "on";
      });
    };
    place();
    // Link widths change when the web font arrives.
    const observer = new ResizeObserver(place);
    observer.observe(list);
    return () => observer.disconnect();
  }, [key]);

  return ref;
}

export function Nav() {
  const { current } = useNavCurrent();
  const scrolled = useScrolled();
  const active = nav.find((item) => current(item));
  const pill = usePill(active?.href);

  return (
    <header className="nav" data-scrolled={scrolled || undefined}>
      <div className="nav__inner container">
        <div className="nav__side">
          <Link className="nav__brand" href="/" aria-label={`${profile.name}, home`}>
            <Mark />
            <span>{profile.handle}</span>
          </Link>
        </div>
        <nav className="nav__links" aria-label="Primary" ref={pill}>
          <span className="nav__pill" aria-hidden="true" />
          {nav.map((item) => (
            <Link
              key={item.href}
              className="nav__link"
              href={item.href}
              aria-current={current(item)}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nav__side nav__side--end">
          <a className="link nav__hello" href={`mailto:${profile.email}`}>
            say hello →
          </a>
        </div>
      </div>
    </header>
  );
}
