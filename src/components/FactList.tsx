import type { Fact } from "../content";
import { Icon, type IconName } from "./Icon";

type FactListProps = { label: string; icon: IconName; items: Fact[]; heading?: "p" | "h2" };

// One group of the fact sheet (the home page's about section and /resume): a
// caps label, then title, place and years.
export function FactList({ label, icon, items, heading: Label = "p" }: FactListProps) {
  return (
    <div className="bio">
      <Label className="bio__label caps">
        <Icon name={icon} size={16} />
        {label}
      </Label>
      <ul className="bio__list">
        {items.map((item) => (
          <li key={item.title} className="bio__item">
            <div>
              <h3 className="blurb__title">{item.title}</h3>
              <p className="bio__place">{item.place}</p>
            </div>
            <span className="bio__years">{item.years}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
