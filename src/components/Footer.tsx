import { lazy, Suspense } from "react";
import { footer, profile } from "../content";
import { Mark } from "./Mark";

const PaperFibre = lazy(() => import("./PaperFibre"));

export function Footer() {
  return (
    <footer className="footer">
      <Suspense fallback={null}>
        <PaperFibre className="footer__paper" />
      </Suspense>
      <div className="footer__inner container">
        <div className="footer__brand">
          <span className="footer__tile">
            <Mark size={26} color="#FCFCF9" />
          </span>
          <div className="footer__sign">
            <a className="link link--soft" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <span className="footer__meta">© 2026 {profile.name}</span>
          </div>
        </div>
        <div className="footer__cols">
          {footer.columns.map((col) => (
            <nav key={col.title} className="footer__col" aria-label={col.title}>
              <p className="footer__title">{col.title}</p>
              {col.links.map((link) => (
                <a key={link.label} className="link link--soft" href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          ))}
        </div>
      </div>
      <svg className="footer__word" viewBox="0 0 2000 520" aria-hidden="true">
        <text
          x="1000"
          y="560"
          textAnchor="middle"
          textLength="1940"
          lengthAdjust="spacingAndGlyphs"
        >
          {profile.handle}
        </text>
      </svg>
    </footer>
  );
}
