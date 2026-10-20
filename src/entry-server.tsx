// Server entry for the prerender (scripts/prerender.ts), built with
// `vp build --ssr`. Renders one page to HTML; the client hydrates it.
import { renderToString } from "react-dom/server";
import App from "./App";

export { notesFeed, pages, site } from "./seo";
export { escapeXml, feed } from "./feed";

export function render(url: string) {
  return renderToString(<App url={url} />);
}
