import { nav } from "../content";
import { Link } from "../router/Link";
import { Icon } from "./Icon";
import { useNavCurrent } from "./useNavCurrent";

// Small screens hide the header links, so the same destinations sit in a bar
// pinned to the bottom, icons only.
export function BottomNav() {
  const { current, onHome, section } = useNavCurrent();

  return (
    <nav className="bottom-nav" aria-label="Primary">
      <ul className="bottom-nav__list">
        <li>
          <Link
            className="bottom-nav__link"
            href="/"
            aria-label="home"
            aria-current={onHome && section === null ? "page" : undefined}
          >
            <Icon name="home" size={22} />
          </Link>
        </li>
        {nav.map((item) => (
          <li key={item.href}>
            <Link
              className="bottom-nav__link"
              href={item.href}
              aria-label={item.label}
              aria-current={current(item)}
            >
              <Icon name={item.icon} size={22} />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
