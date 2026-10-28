import type { CSSProperties } from "react";
import { logoScale, toolLogos } from "./tool-logos";

// The tools, each a logo and its name, drifting sideways on footer paper, closing
// the about section. One group is real; the rest repeat it so the loop has no
// gap, and are hidden from assistive tech. See `.toolbelt` in src/index.css.
const copies = 4;

export function ToolBelt({ label }: { label: string }) {
  return (
    <div className="toolbelt">
      <p className="toolbelt__label">{label}</p>
      <div className="toolbelt__pill">
        <div className="toolbelt__track">
          {Array.from({ length: copies }, (_, copy) => (
            <ul key={copy} className="toolbelt__group" aria-hidden={copy > 0 || undefined}>
              {toolLogos.map((tool) => (
                <li key={tool.name} className="toolbelt__item">
                  <svg
                    viewBox={tool.viewBox}
                    aria-hidden="true"
                    style={{ "--scale": logoScale(tool.viewBox) } as CSSProperties}
                    dangerouslySetInnerHTML={{ __html: tool.markup }}
                  />
                  <span>{tool.name}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
