import { nav, profile } from "../content";
import { Mark } from "./Mark";

export function Nav() {
  return (
    <header className="nav">
      <div className="nav__inner container">
        <div className="nav__side">
          <a className="nav__brand" href="#top" aria-label={`${profile.name}, home`}>
            <Mark />
            <span>{profile.handle}</span>
          </a>
        </div>
        <nav className="nav__links" aria-label="Primary">
          {nav.map((item) => (
            <a key={item.href} className="link link--soft" href={item.href}>
              {item.label}
            </a>
          ))}
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
