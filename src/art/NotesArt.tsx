import { Mark } from "../components/Mark";
import { Cursor } from "./Cursor";

export function CollageArt() {
  return (
    <div className="art art--collage">
      <div className="collage__board">
        <span className="collage__tag">Hero · v3</span>
        <b>design, then ship it</b>
        <span>a product designer who turns canvases into code</span>
        <i className="collage__btn" />
      </div>
      <div className="collage__code">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="collage__sticky">ship friday ✓</div>
      <Cursor name="Salman" tone="you" x={204} y={276} />
      <Cursor name="Claude" tone="agent" x={402} y={56} />
      <Cursor name="Paper MCP" tone="mcp" x={330} y={262} />
    </div>
  );
}

export function PortraitArt() {
  return (
    <div className="art art--portrait">
      <div className="portrait">
        <span className="portrait__dots" />
        <span className="portrait__initials">SA</span>
      </div>
      <span className="portrait__sticker">open to new work</span>
      <span className="portrait__mark">
        <Mark size={28} />
      </span>
    </div>
  );
}
