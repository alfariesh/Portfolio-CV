import "./og.css";
import { Mark } from "../components/Mark";
import { profile } from "../content";
import { figures } from "../iso/figures";
import { IsoFigure } from "../iso/IsoFigure";
import { ogSize, type PageSeo } from "../seo";

// One page's social card, 1200×630, in the site's tokens and fonts so a
// shared link looks like the page it opens.
export function Card({ page }: { page: PageSeo }) {
  const { eyebrow, title, subtitle, figure } = page.card;
  // Case-study art is 4:3 on the site, note covers and the rest 3:2.
  const aspect = page.path.startsWith("/work/") ? 4 / 3 : 3 / 2;
  return (
    <article className="og" style={ogSize}>
      <div className="og__copy">
        <p className="og__brand">
          <span className="og__tile">
            <Mark size={18} color="#FEFEFC" />
          </span>
          {profile.name}
        </p>
        <div>
          <p className="og__eyebrow">{eyebrow}</p>
          <h1 className={title.length > 28 ? "og__title og__title--long" : "og__title"}>{title}</h1>
          {subtitle && <p className="og__subtitle">{subtitle}</p>}
        </div>
        <p className="og__role">{profile.role}</p>
      </div>
      <div className="og__plate">
        <IsoFigure fig={figures[figure]} aspect={aspect} demo="mount" />
      </div>
    </article>
  );
}
