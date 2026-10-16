import { toolLogos } from "./tool-logos";

// The tools, as a band of logos on footer paper, closing the about section.
export function ToolBelt({ label }: { label: string }) {
  return (
    <div className="toolbelt">
      <p className="toolbelt__label">{label}</p>
      <ul className="toolbelt__list">
        {toolLogos.map((tool) => (
          <li key={tool.name} className="toolbelt__item">
            <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
              <path d={tool.path} />
            </svg>
            <span className="toolbelt__name">{tool.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
