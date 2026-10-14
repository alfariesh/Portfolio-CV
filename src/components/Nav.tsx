import { nav, profile } from "../content";
import { useRouter } from "../router/context";
import { Link } from "../router/Link";
import { Mark } from "./Mark";

export function Nav() {
  const { pathname } = useRouter();
  const section = pathname.split("/")[1];

  return (
    <header className="nav">
      <div className="nav__inner container">
        <div className="nav__side">
          <Link className="nav__brand" href="/" aria-label={`${profile.name}, home`}>
            <Mark />
            <span>{profile.handle}</span>
          </Link>
        </div>
        <nav className="nav__links" aria-label="Primary">
          {nav.map((item) => {
            // Every page under /work counts as "work", under /notes as "notes".
            const current = section !== "" && item.href === `/${section}`;
            return (
              <Link
                key={item.href}
                className="link link--soft"
                href={item.href}
                aria-current={current ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="nav__side nav__side--end">
          <a className="link" href={`mailto:${profile.email}`}>
            say hello →
          </a>
        </div>
      </div>
    </header>
  );
}
