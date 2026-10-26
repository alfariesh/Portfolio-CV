import type { CSSProperties } from "react";
import { toolLogos } from "./tool-logos";

// The tools, as a pill of app tiles drifting sideways on footer paper, closing
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
                <li
                  key={tool.name}
                  className="toolbelt__item"
                  title={tool.unnamed ? undefined : tool.name}
                  style={{ "--tint": tool.tint } as CSSProperties}
                >
                  <svg
                    viewBox={tool.viewBox}
                    role={copy === 0 ? "img" : undefined}
                    aria-label={copy === 0 ? tool.name : undefined}
                    dangerouslySetInnerHTML={{ __html: tool.markup }}
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
